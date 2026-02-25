import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CustomerManager } from '@/utils/customerManager';
import { generateOrderNumber, sendOrderToWhatsApp } from '@/utils/whatsappOrder';
import type { CartItem, CustomerData } from '@/types';

interface MenuCheckoutProps {
  cartItems: CartItem[];
  cartTotal: number;
  onOrderSent?: () => void;
  onCartClear?: () => void;
}

export function MenuCheckout({ 
  cartItems, 
  cartTotal, 
  onOrderSent,
  onCartClear 
}: MenuCheckoutProps) {
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (CustomerManager.isReturning()) {
      const saved = CustomerManager.get();
      if (saved) {
        setCustomerData(saved);
      }
    }
  }, []);

  const handleFinalizar = () => {
    if (cartItems.length === 0) return;

    const existing = CustomerManager.get();
    
    if (!existing || !CustomerManager.isReturning()) {
      setShowCustomerForm(true);
    } else {
      if (window.confirm(`Enviar pedido para ${existing.name}?`)) {
        enviarPedido(existing);
      }
    }
  };

  const enviarPedido = (data: CustomerData) => {
    setIsSubmitting(true);
    
    try {
      CustomerManager.save(data);
      const orderNumber = generateOrderNumber();
      
      sendOrderToWhatsApp(
        orderNumber,
        cartItems,
        cartTotal,
        data,
        () => {
          onCartClear?.();
          onOrderSent?.();
          setShowCustomerForm(false);
        }
      );
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      alert('Não foi possível enviar o pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = customerData.name.trim() && 
                      customerData.phone.trim() && 
                      customerData.address.trim();

  return (
    <>
      <Button
        onClick={handleFinalizar}
        disabled={cartItems.length === 0 || isSubmitting}
        className="btn-primary w-full disabled:opacity-50"
      >
        {isSubmitting ? 'Enviando...' : 
         cartItems.length === 0 ? 'Adicione itens ao carrinho' : 'Finalizar Pedido'}
      </Button>

      <Dialog open={showCustomerForm} onOpenChange={setShowCustomerForm}>
        <DialogContent className="bg-[#141419] border border-[#7B2CFF]/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#F4F6FA]">
              {CustomerManager.isReturning() ? 'Confirmar Dados' : 'Seus Dados para Entrega'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-[#A7ACB8]">Nome Completo *</label>
              <input
                type="text"
                className="w-full bg-[#0B0B10] border border-[#2A2A35] rounded-lg p-3 text-[#F4F6FA] focus:border-[#7B2CFF] outline-none"
                value={customerData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Andrôn Varrôn"
                disabled={CustomerManager.isReturning()}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-[#A7ACB8]">WhatsApp (com DDD) *</label>
              <input
                type="tel"
                className="w-full bg-[#0B0B10] border border-[#2A2A35] rounded-lg p-3 text-[#F4F6FA] focus:border-[#7B2CFF] outline-none"
                value={customerData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Ex: 11999999999"
                disabled={CustomerManager.isReturning()}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-[#A7ACB8]">Endereço de Entrega *</label>
              <textarea
                className="w-full bg-[#0B0B10] border border-[#2A2A35] rounded-lg p-3 text-[#F4F6FA] focus:border-[#7B2CFF] outline-none h-24 resize-none"
                value={customerData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Rua, número, bairro, complemento..."
                disabled={CustomerManager.isReturning()}
              />
            </div>
            
            <div className="pt-4 border-t border-[#2A2A35]">
              <p className="text-sm text-[#A7ACB8] mb-2">Resumo do Pedido:</p>
              <ul className="text-sm text-[#F4F6FA] space-y-1 max-h-32 overflow-y-auto">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.quantity}x {item.name}</span>
                    <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <p className="text-lg font-bold text-[#7B2CFF] mt-3 text-right">
                Total: R$ {cartTotal.toFixed(2)}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCustomerForm(false)}
              className="text-[#A7ACB8] border-[#2A2A35] hover:bg-[#2A2A35]"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => enviarPedido(customerData)}
              disabled={!isFormValid || isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar no WhatsApp 🚀'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}