// src/components/MenuCheckout.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { CartItem, CustomerData } from '@/types';

// ============================================================================
// DADOS DO PIX
// ============================================================================

const PIX_DATA = {
  chave: '14838734808',
  nome: 'PATRICIA DE FATIMA FERNANDES SANTOS',
  cidade: 'OSASCO',
};

// ============================================================================
// GERADOR DE PIX PADRÃO EMVCo
// ============================================================================

const gerarPixPayload = (chave: string, valor: number, nome: string, cidade: string): string => {
  const nomeBeneficiario = nome.toUpperCase().padEnd(25, ' ').substring(0, 25);
  const cidadeBeneficiario = cidade.toUpperCase().padEnd(15, ' ').substring(0, 15);
  const txid = Math.random().toString(36).substring(7).toUpperCase().padEnd(25, ' ').substring(0, 25);

  const formatField = (id: string, value: string): string => {
    const size = value.length.toString().padStart(2, '0');
    return `${id}${size}${value}`;
  };

  const payload =
    formatField('00', '01') +
    formatField('26', formatField('00', 'BR.GOV.BCB.PIX') + formatField('01', chave)) +
    formatField('52', '0000') +
    formatField('53', '986') +
    formatField('54', valor.toFixed(2)) +
    formatField('58', 'BR') +
    formatField('59', nomeBeneficiario) +
    formatField('60', cidadeBeneficiario) +
    formatField('62', formatField('05', txid)) +
    '6304';

  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  const crcHex = (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0');

  return payload + crcHex;
};

const gerarPixParaPagamento = (valor: number) => {
  const copiaECola = gerarPixPayload(PIX_DATA.chave, valor, PIX_DATA.nome, PIX_DATA.cidade);
  return { copiaECola };
};

// ============================================================================
// GERADOR DE LINK DA LANDING PAGE DE PAGAMENTO
// ============================================================================

const gerarLinkPagamento = (pixPayload: string, total: number, orderId: string): string => {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams({
    pix: pixPayload,
    amount: total.toFixed(2),
    order: orderId,
    key: PIX_DATA.chave,
    name: PIX_DATA.nome,
  });
  return `${baseUrl}/pagamento.html?${params.toString()}`;
};

// ============================================================================
// GERADOR DE NÚMERO DO PEDIDO
// ============================================================================

const generateOrderNumber = (): string => {
  const d = new Date();
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
  return `LB-${day}${month}-${random}`;
};

// ============================================================================
// ENVIO PARA WHATSAPP + REDIRECIONAMENTO PARA PAGAMENTO
// ============================================================================

const sendOrderToWhatsApp = (
  orderNumber: string,
  items: CartItem[],
  total: number,
  timeSlot: string,
  customer: CustomerData,
  onSent?: () => void
) => {
  const momPhone = '5511945925632';
  const pixData = gerarPixParaPagamento(total);
  const paymentLink = gerarLinkPagamento(pixData.copiaECola, total, orderNumber);

  // ✅ 1. MENSAGEM PARA A SOGRA (limpa, sem links longos)
  let msgMom = `*🍝 NOVO PEDIDO #${orderNumber}*\n`;
  msgMom += `*⏰ Horário:* ${timeSlot}\n\n`;
  msgMom += `*👤 Cliente:* ${customer.name}\n`;
  msgMom += `*📱 Contato:* ${customer.phone}\n`;
  msgMom += `*📍 Entrega:* ${customer.address}\n\n`;
  msgMom += `*🛒 ITENS:*\n━━━━━━━━━━━━━━\n`;

  items.forEach((item, i) => {
    msgMom += `\n*${i + 1}. ${item.name}*\n`;
    msgMom += `   Qtd: ${item.quantity}x | R$ ${item.price.toFixed(2)}\n`;
    msgMom += `   Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    if (item.observations) msgMom += `   _Obs: ${item.observations}_\n`;
  });

  msgMom += `\n━━━━━━━━━━━━━━\n`;
  msgMom += `*💰 TOTAL: R$ ${total.toFixed(2)}*\n\n`;
  msgMom += `*💳 Pagamento:*\n`;
  msgMom += `Cliente foi direcionado para página de pagamento.\n`;
  msgMom += `Aguarde o comprovante neste chat! ✅\n\n`;
  msgMom += `_Dados PIX (fallback):_\n`;
  msgMom += `Chave: ${PIX_DATA.chave}\n`;
  msgMom += `Copia e Cola: \`${pixData.copiaECola}\``;

  // ✅ 2. REDIRECIONA CLIENTE PARA PÁGINA DE PAGAMENTO (prioridade)
  window.open(paymentLink, '_blank');

  // ✅ 3. ENVIA MENSAGEM PARA SOGRA EM SEGUNDO PLANO
  setTimeout(() => {
    const urlMom = `https://wa.me/${momPhone}?text=${encodeURIComponent(msgMom)}`;
    window.open(urlMom, '_blank');
  }, 1500);

  // ✅ 4. FEEDBACK PARA O CLIENTE
  setTimeout(() => {
    alert(
      `✅ Pedido #${orderNumber} enviado!\n\n` +
      `💳 A página de pagamento abriu em outra aba.\n` +
      `1. Complete o pagamento lá\n` +
      `2. Tire print do comprovante\n` +
      `3. Envie para a Patrícia no WhatsApp:\n` +
      `📱 (11) 94592-5632\n\n` +
      `Obrigado pela preferência! 🍝`
    );
    onSent?.();
  }, 2000);
};

// ============================================================================
// GERENCIADOR DE CLIENTES (localStorage)
// ============================================================================

const STORAGE_KEY = 'labella_customer';
const CustomerManager = {
  get: (): CustomerData | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  save: (data: CustomerData) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...data, lastOrder: new Date().toISOString() })
    );
  },
  isReturning: (): boolean => {
    const customer = CustomerManager.get();
    if (!customer?.lastOrder) return false;
    const last = new Date(customer.lastOrder);
    const now = new Date();
    const diffDays = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  },
};

// ============================================================================
// TIPOS DO FLUXO
// ============================================================================

type CheckoutStep = 'idle' | 'selectingTime' | 'enteringData' | 'processing';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

interface MenuCheckoutProps {
  cartItems: CartItem[];
  cartTotal: number;
  onOrderSent?: () => void;
}

export function MenuCheckout({ cartItems, cartTotal, onOrderSent }: MenuCheckoutProps) {
  // ✅ ESTADO ÚNICO CONTROLANDO TODO O FLUXO
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('idle');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    phone: '',
    address: '',
  });

  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = 11 + Math.floor(i / 3);
    const min = (i % 3) * 20;
    const start = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
    const endMin = min + 20;
    const endHour = endMin >= 60 ? hour + 1 : hour;
    const end = `${endHour.toString().padStart(2, '0')}:${(endMin % 60).toString().padStart(2, '0')}`;
    return { label: `${start} às ${end}`, value: `${start} às ${end}` };
  });

  // Carrega dados de cliente retornante
  useEffect(() => {
    if (CustomerManager.isReturning()) {
      const saved = CustomerManager.get();
      if (saved) setCustomerData(saved);
    }
  }, []);

  // ✅ INICIA O FLUXO: clica em "Finalizar Pedido"
  const handleIniciarCheckout = () => {
    if (cartItems.length === 0) return;
    setCheckoutStep('selectingTime');
  };

  // ✅ SELECIONA HORÁRIO: avança para próximo passo
  const handleSelecionarHorario = (slotValue: string) => {
    console.log('⏰ Horário selecionado:', slotValue);
    setSelectedTimeSlot(slotValue);
    
    const existing = CustomerManager.get();
    
    if (!existing || !CustomerManager.isReturning()) {
      // Novo cliente: vai para cadastro
      setCheckoutStep('enteringData');
    } else {
      // Cliente retornante: envia direto
      handleEnviarPedido(existing, slotValue);
    }
  };

  // ✅ ENVIA PEDIDO: processa e redireciona
  const handleEnviarPedido = (data: CustomerData, timeSlot: string) => {
    setCheckoutStep('processing');
    
    // Salva dados do cliente
    CustomerManager.save(data);
    
    // Gera número do pedido e envia
    const orderNumber = generateOrderNumber();
    sendOrderToWhatsApp(orderNumber, cartItems, cartTotal, timeSlot, data, () => {
      // Reset após envio
      setCheckoutStep('idle');
      setSelectedTimeSlot('');
      onOrderSent?.();
    });
  };

  return (
    <>
      {/* Botão principal - só habilita se tiver itens */}
      <button
        onClick={handleIniciarCheckout}
        disabled={cartItems.length === 0 || checkoutStep !== 'idle'}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cartItems.length === 0 
          ? 'Adicione itens ao carrinho' 
          : checkoutStep === 'processing' 
            ? 'Processando...' 
            : 'Finalizar Pedido'}
      </button>

      {/* ✅ MODAL: Seleção de Horário */}
      <Dialog 
        open={checkoutStep === 'selectingTime'} 
        onOpenChange={(open) => {
          if (!open) setCheckoutStep('idle');
        }}
      >
        <DialogContent className="bg-[#141419] border border-[#7B2CFF]/30 z-[100]">
          <DialogHeader>
            <DialogTitle className="text-[#F4F6FA]">⏰ Escolha o Horário</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm text-[#A7ACB8] block mb-3">Entrega/Retirada:</label>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() => handleSelecionarHorario(slot.value)}
                  className="p-3 rounded-lg border text-sm font-mono bg-[#0B0B10] border-[#2A2A35] text-[#A7ACB8] hover:border-[#7B2CFF] transition-colors"
                >
                  {slot.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-[#A7ACB8] text-center mt-4">
              Selecione um horário para continuar
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✅ MODAL: Cadastro de Cliente (apenas novos) */}
      <Dialog 
        open={checkoutStep === 'enteringData'} 
        onOpenChange={(open) => {
          if (!open) setCheckoutStep('selectingTime'); // Volta para seleção de horário se cancelar
        }}
      >
        <DialogContent className="bg-[#141419] border border-[#7B2CFF]/30 max-w-md z-[100]">
          <DialogHeader>
            <DialogTitle className="text-[#F4F6FA]">📋 Seus Dados para Entrega</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-[#A7ACB8]">Nome Completo</label>
              <input
                type="text"
                className="w-full bg-[#0B0B10] border border-[#2A2A35] rounded-lg p-3 text-[#F4F6FA] focus:border-[#7B2CFF] outline-none"
                value={customerData.name}
                onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                placeholder="Ex: Andrôn Varrôn"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#A7ACB8]">WhatsApp (com DDD)</label>
              <input
                type="tel"
                className="w-full bg-[#0B0B10] border border-[#2A2A35] rounded-lg p-3 text-[#F4F6FA] focus:border-[#7B2CFF] outline-none"
                value={customerData.phone}
                onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                placeholder="Ex: 11999999999"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#A7ACB8]">Endereço de Entrega</label>
              <textarea
                className="w-full bg-[#0B0B10] border border-[#2A2A35] rounded-lg p-3 text-[#F4F6FA] focus:border-[#7B2CFF] outline-none h-24 resize-none"
                value={customerData.address}
                onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                placeholder="Rua, número, bairro, complemento..."
              />
            </div>
            <button
              onClick={() => {
                if (customerData.name && customerData.phone && customerData.address && selectedTimeSlot) {
                  handleEnviarPedido(customerData, selectedTimeSlot);
                } else {
                  alert('Preencha todos os campos para continuar.');
                }
              }}
              disabled={!customerData.name || !customerData.phone || !customerData.address}
              className="w-full btn-primary mt-2 disabled:opacity-50"
            >
              Enviar Pedido no WhatsApp 🚀
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✅ FEEDBACK: Processando */}
      {checkoutStep === 'processing' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200]">
          <div className="bg-[#141419] border border-[#7B2CFF]/30 rounded-xl p-6 text-center">
            <div className="text-2xl mb-4">🔄</div>
            <p className="text-[#F4F6FA]">Enviando seu pedido...</p>
            <p className="text-[#A7ACB8] text-sm mt-2">Aguarde, abrindo página de pagamento.</p>
          </div>
        </div>
      )}
    </>
  );
}