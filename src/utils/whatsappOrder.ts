// utils/whatsappOrder.ts
import type { CartItem, CustomerData } from '@/types';

export function generateOrderNumber(): string {
  // Ex: LB-240224-001 (La Bella + data + sequencial do dia)
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
  return `LB-${day}${month}-${random}`;
}

export function sendOrderToWhatsApp(
  orderNumber: string,
  items: CartItem[],
  total: number,
  timeSlot: string,
  customer: CustomerData,
  onSent?: () => void
) {
  const momPhone = '5511945925632'; // Sua sogra

  // Mensagem para a mãe
  let msgMom = `*🍝 NOVO PEDIDO #${orderNumber}*\n`;
  msgMom += `*⏰ Horário:* ${timeSlot}\n\n`;
  msgMom += `*👤 Cliente:* ${customer.name}\n`;
  msgMom += `*📱 Contato:* ${customer.phone}\n`;
  msgMom += `*📍 Entrega:* ${customer.address}\n\n`;
  msgMom += `*🛒 ITENS:*\n`;
  msgMom += `━━━━━━━━━━━━━━\n`;
  
  items.forEach((item, i) => {
    msgMom += `\n*${i+1}. ${item.name}*\n`;
    msgMom += `   Qtd: ${item.quantity}x | R$ ${item.price.toFixed(2)}\n`;
    msgMom += `   Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    if (item.observations) msgMom += `   _Obs: ${item.observations}_\n`;
  });
  
  msgMom += `\n━━━━━━━━━━━━━━`;
  msgMom += `\n*💰 TOTAL: R$ ${total.toFixed(2)}*\n`;
  msgMom += `\n_Aguardo confirmação e chave Pix!_`;

  // Mensagem de cópia para o cliente
  let msgClient = `*✅ Pedido #${orderNumber} Confirmado!*\n`;
  msgClient += `*La Bella Grattia*\n\n`;
  msgClient += `*⏰ Entrega:* ${timeSlot}\n`;
  msgClient += `*📍 Local:* ${customer.address}\n\n`;
  msgClient += `*Resumo:*\n`;
  items.forEach(item => {
    msgClient += `• ${item.quantity}x ${item.name}\n`;
  });
  msgClient += `\n*Total: R$ ${total.toFixed(2)}*\n\n`;
  msgClient += `🔹 *Próximos passos:*\n`;
  msgClient += `1. Aguarde nosso WhatsApp com a chave Pix\n`;
  msgClient += `2. Após pagamento, enviaremos o comprovante\n`;
  msgClient += `3. Sua marmita sairá na faixa horária escolhida!\n\n`;
  msgClient += `Dúvidas? Responda esta mensagem. 🙏`;

  // Abre WhatsApp da mãe primeiro
  const urlMom = `https://wa.me/${momPhone}?text=${encodeURIComponent(msgMom)}`;
  
  // Após 2 segundos, sugere envio da cópia para o cliente
  setTimeout(() => {
    const confirmCopy = window.confirm(
      '✅ Pedido enviado para a cozinha!\n\n' +
      'Deseja receber uma cópia do seu pedido no seu WhatsApp?'
    );
    
    if (confirmCopy && customer.phone) {
      // Remove caracteres não numéricos do telefone do cliente
      const clientPhone = customer.phone.replace(/\D/g, '');
      const fullClientPhone = clientPhone.startsWith('55') ? clientPhone : `55${clientPhone}`;
      const urlClient = `https://wa.me/${fullClientPhone}?text=${encodeURIComponent(msgClient)}`;
      window.open(urlClient, '_blank');
    }
    
    onSent?.();
  }, 2000);

  window.open(urlMom, '_blank');
}
