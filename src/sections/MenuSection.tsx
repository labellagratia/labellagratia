// components/MenuCheckout.tsx (novo componente unificado)
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TimeSlotSelector } from './TimeSlotSelector';
import { CustomerManager } from '@/utils/customerManager';
import { generateOrderNumber, sendOrderToWhatsApp } from '@/utils/whatsappOrder';
import type { CartItem, CustomerData } from '@/types';

interface MenuCheckoutProps {
  cartItems: CartItem[];
  cartTotal: number;
  onOrderSent?: () => void;
}

export function MenuCheckout({ cartItems, cartTotal, onOrderSent }: MenuCheckoutProps) {
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    phone: '',
    address: ''
  });

  // Verifica se é cliente retornando ao montar
  useEffect(() => {
    if (CustomerManager.isReturning()) {
      const saved = CustomerManager.get();
      if (saved) {
        setCustomerData(saved);
        // Opcional: abrir modal de revisão direto
        // setShowReview(true);
      }
    }
  }, []);

  const handleFinalizar = () => {
    if (!timeSlot) {
      alert('Por favor, selecione um horário de entrega.');
      return;
    }

    const existing = CustomerManager.get();
    
    if (!existing || !CustomerManager.isReturning()) {
      // Novo cliente: mostra popup de cadastro
      setShowCustomerForm(true);
    } else {
      // Cliente conhecido: envia direto
      enviarPedido(customerData);
    }
  };

  const enviarPedido = (data: CustomerData) => {
    // Salva dados do cliente
    CustomerManager.save(data);
    
    // Gera número do pedido
    const orderNumber = generateOrderNumber();
    
    // Envia para WhatsApp
    sendOrderToWhatsApp(
      orderNumber,
      cartItems,
      cartTotal,
      timeSlot,
      data,
      () => {
        // Opcional: limpar carrinho após envio
        // onCartClear?.();
        onOrderSent?.();
      }
    );
  };

  return (
    <>
      {/* Botão de finalizar no Menu */}
      <button
        onClick={handleFinalizar}
        disabled={cartItems.length === 0}
        className="btn-primary w-full disabled:opacity-50"
      >
        {cartItems.length === 0 ? 'Adicione itens ao carrinho' : 'Finalizar Pedido'}
      </button>

      {/* Modal de Cadastro (Novos Clientes) */}
      <Dialog open={showCustomerForm} onOpenChange={setShowCustomerForm}>
        <DialogContent className="bg-[#141419] border border-[#7B2CFF]/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#F4F6FA]">
              📋 Seus Dados para Entrega
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-[#A7ACB8]">Nome Completo</label>
              <input
                type="text"
                className="w-full bg-[#0B0B10] border border-[#2A2A35] rounded-lg p-3 text-[#F4F6FA] focus:border-[#7B2CFF] outline-none"
                value={customerData.name}
                onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                placeholder="Ex: Andrôn Varrôn"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-[#A7ACB8]">WhatsApp (com DDD)</label>
              <input
                type="tel"
                className="w-full bg-[#0B0B10] border border-[#2A2A35] rounded-lg p-3 text-[#F4F6FA] focus:border-[#7B2CFF] outline-none"
                value={customerData.phone}
                onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                placeholder="Ex: 11999999999"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-[#A7ACB8]">Endereço de Entrega</label>
              <textarea
                className="w-full bg-[#0B0B10] border border-[#2A2A35] rounded-lg p-3 text-[#F4F6FA] focus:border-[#7B2CFF] outline-none h-24 resize-none"
                value={customerData.address}
                onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                placeholder="Rua, número, bairro, complemento..."
              />
            </div>
            
            <button
              onClick={() => enviarPedido(customerData)}
              disabled={!customerData.name || !customerData.phone || !customerData.address}
              className="w-full btn-primary mt-2 disabled:opacity-50"
            >
              Enviar Pedido no WhatsApp 🚀
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Seleção de Horário (pode ser inline no menu também) */}
      {!timeSlot && cartItems.length > 0 && (
        <Dialog open={!showCustomerForm} onOpenChange={() => {}}>
          <DialogContent className="bg-[#141419] border border-[#7B2CFF]/30">
            <DialogHeader>
              <DialogTitle className="text-[#F4F6FA]">
                ⏰ Escolha o Horário
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <TimeSlotSelector 
                selected={timeSlot} 
                onSelect={(slot) => {
                  setTimeSlot(slot);
                  // Após selecionar, prossegue para finalizar
                  setTimeout(handleFinalizar, 300);
                }} 
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}