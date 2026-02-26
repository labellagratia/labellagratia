// src/sections/MenuSection.tsx
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CustomerManager } from '@/utils/customerManager';
import { generateOrderNumber } from '@/utils/whatsappOrder';
import type { CartItem } from '@/types';
import type { MenuCategory } from '@/types/menu';
import { CATEGORIAS } from '@/types/menu';
import { getItemsByCategory } from '@/data/menu';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight, 
  X,
  UtensilsCrossed,
  Salad,
  GlassWater,
  IceCream,
  ShoppingBag
} from 'lucide-react';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

// Mapeamento de ícones por categoria
const CATEGORY_ICONS = {
  principal: UtensilsCrossed,
  acompanhamento: Salad,
  bebida: GlassWater,
  sobremesa: IceCream,
};

const PIX_CONFIG = {
  pixKey: '14838734808',
  merchantName: 'Patricia de Fatima Fernandes dos Santos',
  merchantCity: 'OSASCO',
};

const DELIVERY_HOURS = ['11', '12', '13', '14'] as const;
type DeliveryHour = typeof DELIVERY_HOURS[number];

const DELIVERY_SLOTS: Record<DeliveryHour, string[]> = {
  '11': ['11:00 - 11:20', '11:20 - 11:40', '11:40 - 12:00'],
  '12': ['12:00 - 12:20', '12:20 - 12:40', '12:40 - 13:00'],
  '13': ['13:00 - 13:20', '13:20 - 13:40', '13:40 - 14:00'],
  '14': ['14:00 - 14:20', '14:20 - 14:40', '14:40 - 15:00'],
};

interface MenuSectionProps {
  isOrderingOpen: boolean;
}

// Funções PIX mantidas iguais...
function generatePixCode(params: {
  pixKey: string;
  amount: number;
  description: string;
  merchantName: string;
  merchantCity: string;
  txid: string;
}): string {
  const { pixKey, amount, description, merchantName, merchantCity, txid } = params;
  const field = (id: string, value: string): string => {
    const length = value.length.toString().padStart(2, '0');
    return `${id}${length}${value}`;
  };
  const payload = [
    field('00', '01'),
    field('26', [field('00', 'br.gov.bcb.pix'), field('01', pixKey), description ? field('02', description.substring(0, 40)) : ''].join('')),
    field('52', '0000'), field('53', '986'), field('54', amount.toFixed(2)),
    field('58', 'BR'), field('59', merchantName.substring(0, 25)), field('60', merchantCity.substring(0, 15)),
    field('62', field('05', txid.substring(0, 25))),
  ].join('');
  const crc16 = calculateCRC16(payload + '6304');
  return payload + '6304' + crc16;
}

function calculateCRC16(str: string): string {
  let crc = 0xFFFF;
  const polynomial = 0x1021;
  for (let i = 0; i < str.length; i++) {
    const byte = str.charCodeAt(i);
    crc ^= (byte << 8);
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) crc = (crc << 1) ^ polynomial;
      else crc = crc << 1;
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function MenuSection({ isOrderingOpen }: MenuSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Estados das abas e navegação
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('principal');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Dados filtrados pela categoria atual
  const items = getItemsByCategory(activeCategory);
  const currentItem = items[currentIndex] || items[0];
  
  // Estados do carrinho e checkout
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerData, setCustomerData] = useState({ name: '', phone: '', address: '' });
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [orderId, setOrderId] = useState('');
  const [selectedHour, setSelectedHour] = useState<DeliveryHour | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'form' | 'pix' | 'confirmation'>('form');

  const savedCustomer = CustomerManager.get();
  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  // Resetar índice quando muda de categoria
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  // GSAP animations...
  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(content, 
        { y: 40, opacity: 0 }, 
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 80%' }
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (savedCustomer) setCustomerData({ 
      name: savedCustomer.name || '', 
      phone: savedCustomer.phone || '', 
      address: savedCustomer.address || '' 
    });
  }, []);

  useEffect(() => {
    if (!showCheckout) {
      setPaymentStep('form'); 
      setPixCode(null); 
      setOrderId(''); 
      setSelectedHour(null); 
      setSelectedSlot(null);
    }
  }, [showCheckout]);

  const addToCart = () => {
    if (!isOrderingOpen || !currentItem) { 
      toast.error('Pedidos encerrados'); 
      return; 
    }
    setCartItems(prev => {
      const existing = prev.find(i => i.id === currentItem.id);
      if (existing) return prev.map(i => 
        i.id === currentItem.id ? { ...i, quantity: i.quantity + 1 } : i
      );
      return [...prev, { 
        id: currentItem.id, 
        name: currentItem.nome, 
        price: currentItem.preco, 
        quantity: 1 
      }];
    });
    toast.success(`${currentItem.nome} adicionado!`);
  };

  const updateQty = (itemId: string, delta: number) => {
    const item = cartItems.find(i => i.id === itemId);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      setCartItems(prev => prev.filter(i => i.id !== itemId));
    } else {
      setCartItems(prev => prev.map(i => 
        i.id === itemId ? { ...i, quantity: newQty } : i
      ));
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(i => i.id !== itemId));
  };

  const generatePix = () => {
    if (!customerData.name.trim() || !customerData.phone.trim() || !selectedSlot) {
      toast.error('Preencha dados e horário'); 
      return;
    }
    if (total <= 0) { 
      toast.error('Carrinho vazio'); 
      return;
    }
    
    try {
      const newOrderId = generateOrderNumber();
      setOrderId(newOrderId);
      const code = generatePixCode({
        pixKey: PIX_CONFIG.pixKey, 
        amount: total, 
        description: `Pedido #${newOrderId}`,
        merchantName: PIX_CONFIG.merchantName, 
        merchantCity: PIX_CONFIG.merchantCity, 
        txid: newOrderId.substring(0, 25),
      });
      setPixCode(code); 
      setPaymentStep('pix');
      CustomerManager.save(customerData);
      toast.success('PIX gerado! Copie e pague.', { duration: 6000 });
    } catch (error) { 
      toast.error('Erro ao gerar PIX'); 
    }
  };

  const copyPix = async () => {
    if (!pixCode) return;
    try { 
      await navigator.clipboard.writeText(pixCode); 
      toast.success('Copiado!'); 
    } catch { 
      const t = document.createElement('textarea'); 
      t.value = pixCode; 
      document.body.appendChild(t); 
      t.select(); 
      document.execCommand('copy'); 
      document.body.removeChild(t); 
      toast.success('Copiado!');
    }
  };

  const confirmPayment = () => {
    if (!pixCode || !orderId || !selectedSlot) return;
    const msg = encodeURIComponent(
      `🍽️ *NOVO PEDIDO - La Bella Gratia*\n\n*Pedido:* #${orderId}\n*Cliente:* ${customerData.name}\n*Tel:* ${customerData.phone}\n*End:* ${customerData.address || 'Retirada'}\n*Entrega:* ${selectedSlot}\n\n*Itens:*\n${cartItems.map(i => `• ${i.name} x${i.quantity} - R$${(i.price * i.quantity).toFixed(2)}`).join('\n')}\n\n*TOTAL: R$${total.toFixed(2)}* ✅\n_PIX confirmado_`
    );
    window.open(`https://wa.me/5511945925632?text=${msg}`, '_blank');
    setPaymentStep('confirmation');
    toast.success('Pedido enviado!', { duration: 8000 });
    setTimeout(() => { 
      setShowCheckout(false); 
      setCartItems([]); 
      setPaymentStep('form'); 
      setPixCode(null); 
    }, 3000);
  };

  // Se não houver itens na categoria
  if (!currentItem) {
    return (
      <section ref={sectionRef} id="menu" className="relative z-[70] bg-[#0B0B10] min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[#A7ACB8]">Nenhum item disponível nesta categoria.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section ref={sectionRef} id="menu" className="relative z-[70] bg-[#0B0B10] min-h-screen py-12 lg:py-0">
        {/* Background */}
        <div className="hidden lg:block absolute inset-0 bg-[url('/backdrop.jpg')] bg-cover bg-center bg-fixed" />
        <div className="hidden lg:block absolute inset-0 bg-[#0B0B10]/10" />
        
        <div ref={contentRef} className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 h-full">
          
          {/* ABAS DE CATEGORIA */}
          <div className="flex justify-center mb-8 pt-4 lg:pt-10">
            <div className="inline-flex flex-wrap justify-center gap-2 p-2 bg-[#141419]/80 backdrop-blur-sm rounded-2xl border border-[rgba(244,246,250,0.1)]">
              {CATEGORIAS.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.id];
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                      activeCategory === cat.id
                        ? 'bg-[#7B2CFF] text-[#0B0B10]'
                        : 'text-[#A7ACB8] hover:text-[#F4F6FA] hover:bg-[#2A2A35]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Layout principal */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:h-[calc(100vh-140px)] gap-8 lg:gap-12">
            
            {/* COLUNA ESQUERDA: Info + Carrinho */}
            <div className="w-full lg:w-[45%] order-2 lg:order-1">
              <div className="bg-[#141419]/90 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none rounded-2xl lg:rounded-none p-6 lg:p-0 border border-[#2A2A35] lg:border-0">
                
                {/* Badge de categoria */}
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 bg-[#7B2CFF]/10 border border-[#7B2CFF]/30 text-[#7B2CFF] text-xs font-bold px-3 py-1.5 rounded-full uppercase">
                    {CATEGORIAS.find(c => c.id === activeCategory)?.label}
                  </span>
                </div>

                {/* Navegação entre itens da categoria */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[#A7ACB8] text-xs font-bold uppercase tracking-wider">
                    {currentIndex + 1} / {items.length}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrentIndex((p) => (p - 1 + items.length) % items.length)} 
                      disabled={items.length <= 1}
                      className="w-10 h-10 rounded-full bg-[#2A2A35] text-[#F4F6FA] hover:bg-[#7B2CFF] transition-all flex items-center justify-center disabled:opacity-30"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setCurrentIndex((p) => (p + 1) % items.length)} 
                      disabled={items.length <= 1}
                      className="w-10 h-10 rounded-full bg-[#2A2A35] text-[#F4F6FA] hover:bg-[#7B2CFF] transition-all flex items-center justify-center disabled:opacity-30"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <h2 className="text-3xl lg:text-[clamp(32px,3vw,48px)] font-bold text-[#F4F6FA] mb-4 leading-tight">
                  {currentItem.nome}
                </h2>
                <p className="text-[#A7ACB8] leading-relaxed mb-6 text-sm lg:text-base max-w-md">
                  {currentItem.descricao}
                </p>
                
                {/* Tags */}
                {currentItem.tags && currentItem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentItem.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase tracking-wider bg-[#2A2A35] text-[#A7ACB8] px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-3xl font-bold text-[#7B2CFF]">
                    R$ {currentItem.preco.toFixed(2)}
                  </span>
                  <span className={`text-sm ${currentItem.disponivel ? 'text-green-400' : 'text-red-400'}`}>
                    {currentItem.disponivel ? '✓ Disponível' : '✗ Esgotado'}
                  </span>
                </div>

                {/* Carrinho */}
                <div className="space-y-4">
                  {cartItems.find(i => i.id === currentItem.id) ? (
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateQty(currentItem.id, -1)} 
                        className="w-12 h-12 rounded-xl bg-[#2A2A35] text-[#F4F6FA] text-xl hover:bg-[#3A3A45] transition-colors"
                      >
                        −
                      </button>
                      <span className="w-16 text-center text-[#F4F6FA] text-xl font-bold">
                        {cartItems.find(i => i.id === currentItem.id)?.quantity || 0}
                      </span>
                      <button 
                        onClick={addToCart} 
                        className="w-12 h-12 rounded-xl bg-[#7B2CFF] text-[#0B0B10] text-xl font-bold hover:bg-[#9B4CFF] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <Button 
                      onClick={addToCart} 
                      disabled={!currentItem.disponivel || !isOrderingOpen} 
                      className="w-full lg:w-auto btn-primary px-8 disabled:opacity-50"
                    >
                      {isOrderingOpen && currentItem.disponivel ? 'Adicionar' : isOrderingOpen ? 'Esgotado' : 'Encerrado'}
                    </Button>
                  )}

                  {/* Resumo do carrinho */}
                  {itemCount > 0 && (
                    <div className="pt-4 border-t border-[rgba(244,246,250,0.1)]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#A7ACB8] text-sm">{itemCount} item(s) no carrinho</span>
                        <button 
                          onClick={() => setShowCheckout(true)}
                          className="text-[#7B2CFF] text-sm hover:underline"
                        >
                          Ver carrinho
                        </button>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[#F4F6FA] font-semibold">Total</span>
                        <span className="text-[#7B2CFF] font-bold text-2xl">R$ {total.toFixed(2)}</span>
                      </div>
                      <Button 
                        onClick={() => setShowCheckout(true)} 
                        className="w-full btn-primary text-lg py-6 flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Finalizar Pedido
                      </Button>
                    </div>
                  )}
                </div>

                <p className="text-[#A7ACB8] text-xs mt-8">
                  🟢 Pedidos até sexta, 20h • 📍 Retirada sábado 11h-15h
                </p>
              </div>
            </div>

            {/* COLUNA DIREITA: Imagem */}
            <div className="w-full lg:w-[50%] order-1 lg:order-2">
              <div className="relative aspect-[4/3] lg:aspect-[4/5] lg:h-[70vh] rounded-2xl lg:rounded-[28px] overflow-hidden shadow-2xl border border-[#2A2A35]">
                <img 
                  src={currentItem.imagemUrl || '/cta_plate.jpg'} 
                  alt={currentItem.nome} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B10]/40 to-transparent lg:hidden" />
                
                {/* Indicadores de navegação */}
                {items.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 lg:hidden">
                    {items.map((_, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setCurrentIndex(idx)} 
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-[#7B2CFF] w-6' : 'bg-white/50'}`} 
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Indicadores desktop */}
              {items.length > 1 && (
                <div className="hidden lg:flex justify-center gap-2 mt-6">
                  {items.map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setCurrentIndex(idx)} 
                      className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-[#7B2CFF] w-6' : 'bg-[#F4F6FA]/30'}`} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="bg-[#141419] border border-[#7B2CFF]/20 max-w-md max-h-[90vh] overflow-y-auto p-0 gap-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-[#F4F6FA] text-xl flex items-center justify-between">
              {paymentStep === 'form' && 'Finalizar Pedido'}
              {paymentStep === 'pix' && 'Pagamento PIX'}
              {paymentStep === 'confirmation' && 'Pedido Enviado! 🎉'}
              <button onClick={() => setShowCheckout(false)} className="text-[#A7ACB8] hover:text-[#F4F6FA]">
                <X className="w-5 h-5" />
              </button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6 pt-2 space-y-4">
            {paymentStep === 'form' && (
              <>
                {/* Lista de itens do carrinho com controles de quantidade */}
                <div className="bg-[#0B0B10] rounded-xl p-4 space-y-3">
                  <h4 className="text-[#A7ACB8] text-xs font-bold uppercase mb-2">Itens do Pedido</h4>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-[#F4F6FA] text-sm">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQty(item.id, -1)}
                          className="w-6 h-6 rounded bg-[#2A2A35] text-[#A7ACB8] hover:text-[#F4F6FA] flex items-center justify-center"
                        >
                          −
                        </button>
                        <span>{item.quantity}x</span>
                        <button 
                          onClick={() => updateQty(item.id, 1)}
                          className="w-6 h-6 rounded bg-[#2A2A35] text-[#A7ACB8] hover:text-[#F4F6FA] flex items-center justify-center"
                        >
                          +
                        </button>
                        <span className="ml-2">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-[#2A2A35] pt-2 mt-2 flex justify-between text-[#7B2CFF] font-bold text-lg">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Formulário de dados */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-[#A7ACB8] block mb-1">Nome Completo *</label>
                    <input 
                      type="text" 
                      value={customerData.name} 
                      onChange={(e) => setCustomerData({...customerData, name: e.target.value})} 
                      className="w-full bg-[#0B0B10] border border-[#2A2A35] rounded-lg p-3 text-[#F4F6FA] text-sm focus:border-[#7B2CFF] outline-none" 
                      placeholder="Seu nome" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#A7ACB8] block mb-1">WhatsApp *</label>
                    <input 
                      type="tel" 
                      value={customerData.phone} 
                      onChange={(e) => setCustomerData({...customerData, phone: e.target.value})} 
                      className="w-full bg-[#0B0B10] border border-[#2A2A35] rounded-lg p-3 text-[#F4F6FA] text-sm focus:border-[#7B2CFF] outline-none" 
                      placeholder="11999999999" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#A7ACB8] block mb-1">Endereço</label>
                    <textarea 
                      value={customerData.address} 
                      onChange={(e) => setCustomerData({...customerData, address: e.target.value})} 
                      className="w-full bg-[#0B0B10] border border-[#2A2A35] rounded-lg p-3 text-[#F4F6FA] text-sm focus:border-[#7B2CFF] outline-none h-16 resize-none" 
                      placeholder="Rua, número, bairro..." 
                    />
                  </div>
                </div>

                {/* Seleção de horário */}
                <div className="space-y-3">
                  <h4 className="text-[#A7ACB8] text-xs font-bold uppercase flex items-center gap-2">
                    🕐 Horário de Entrega *
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {DELIVERY_HOURS.map((hour) => (
                      <button 
                        key={hour} 
                        onClick={() => { setSelectedHour(hour); setSelectedSlot(null); }} 
                        className={`py-2 rounded-lg text-sm font-bold transition-all ${
                          selectedHour === hour ? 'bg-[#7B2CFF] text-[#0B0B10]' : 'bg-[#2A2A35] text-[#A7ACB8]'
                        }`}
                      >
                        {hour}h
                      </button>
                    ))}
                  </div>
                  {selectedHour && (
                    <div className="space-y-2">
                      {DELIVERY_SLOTS[selectedHour].map((slot) => (
                        <button 
                          key={slot} 
                          onClick={() => setSelectedSlot(slot)} 
                          className={`w-full py-2.5 px-3 rounded-lg text-sm transition-all flex items-center justify-between ${
                            selectedSlot === slot ? 'bg-[#7B2CFF]/20 border border-[#7B2CFF] text-[#F4F6FA]' : 'bg-[#0B0B10] border border-[#2A2A35] text-[#A7ACB8]'
                          }`}
                        >
                          <span>{slot}</span>
                          {selectedSlot === slot && <CheckCircle2 className="w-4 h-4 text-[#7B2CFF]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {savedCustomer && (
                  <button 
                    onClick={() => { 
                      CustomerManager.clear?.(); 
                      if (!CustomerManager.clear) localStorage.removeItem('@labellagratia:customer'); 
                      setCustomerData({ name: '', phone: '', address: '' }); 
                    }} 
                    className="text-xs text-[#A7ACB8] hover:text-[#7B2CFF] underline"
                  >
                    ✏️ Limpar dados salvos
                  </button>
                )}
              </>
            )}

            {/* PIX e Confirmação */}
            {paymentStep === 'pix' && pixCode && (
              <div className="space-y-4">
                <div className="bg-[#0B0B10] rounded-xl p-4 text-center">
                  <p className="text-[#A7ACB8] text-xs mb-1">Valor a pagar</p>
                  <p className="text-3xl font-bold text-[#7B2CFF]">R$ {total.toFixed(2)}</p>
                  <p className="text-[#6B7280] text-xs mt-1">Pedido #{orderId}</p>
                </div>

                <div className="bg-[#0B0B10] rounded-xl p-4">
                  <p className="text-[#A7ACB8] text-xs mb-2">Código PIX (Copia e Cola):</p>
                  <div className="bg-[#1E1E24] rounded-lg p-3 font-mono text-[10px] text-[#F4F6FA] break-all max-h-32 overflow-y-auto mb-3">
                    {pixCode}
                  </div>
                  <button onClick={copyPix} className="w-full bg-[#7B2CFF] text-[#0B0B10] font-bold py-3 rounded-lg hover:bg-[#9B4CFF] transition-colors flex items-center justify-center gap-2">
                    Copiar Código PIX
                  </button>
                </div>

                <div className="bg-[#7B2CFF]/10 rounded-xl p-4 border border-[#7B2CFF]/30">
                  <p className="text-[#F4F6FA] text-sm font-semibold mb-2">Como pagar:</p>
                  <ol className="text-[#A7ACB8] text-xs space-y-1.5 list-decimal list-inside">
                    <li>Toque em <strong className="text-[#F4F6FA]">"Copiar Código PIX"</strong> acima</li>
                    <li>Abra o app do seu banco</li>
                    <li>Vá em <strong className="text-[#F4F6FA]">PIX → Copia e Cola</strong></li>
                    <li>Cole o código e confirme o pagamento</li>
                    <li>Volte aqui e toque em <strong className="text-[#F4F6FA]">"Já paguei"</strong></li>
                  </ol>
                </div>

                <div className="bg-[#0B0B10] rounded-lg p-3">
                  <p className="text-[#A7ACB8] text-xs">Entrega selecionada:</p>
                  <p className="text-[#7B2CFF] font-bold">{selectedSlot}</p>
                </div>
              </div>
            )}

            {paymentStep === 'confirmation' && (
              <div className="text-center space-y-4 py-6">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <p className="text-[#F4F6FA] text-lg font-semibold">Pagamento confirmado!</p>
                <p className="text-[#A7ACB8] text-sm">Seu pedido foi enviado para nosso WhatsApp.</p>
                <div className="bg-[#0B0B10] rounded-lg p-4 mt-4">
                  <p className="text-[#A7ACB8] text-xs">Horário de entrega:</p>
                  <p className="text-[#7B2CFF] font-bold text-lg">{selectedSlot}</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 pt-2 border-t border-[#2A2A35]">
            {paymentStep === 'form' && (
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCheckout(false)} 
                  className="flex-1 text-[#A7ACB8] border-[#2A2A35] hover:bg-[#2A2A35]"
                >
                  Continuar Comprando
                </Button>
                <Button 
                  onClick={generatePix} 
                  disabled={!customerData.name.trim() || !customerData.phone.trim() || !selectedSlot || cartItems.length === 0} 
                  className="flex-1 btn-primary"
                >
                  Gerar PIX <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
            {paymentStep === 'pix' && (
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setPaymentStep('form')} 
                  className="flex-1 text-[#A7ACB8] border-[#2A2A35] hover:bg-[#2A2A35]"
                >
                  Voltar
                </Button>
                <Button 
                  onClick={confirmPayment} 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Já paguei ✓
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}