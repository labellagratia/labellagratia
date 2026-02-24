import { useEffect, useState } from 'react';

export default function Review() {
  const [cliente, setCliente] = useState<any>(null);
  const [horario, setHorario] = useState('');
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const c = localStorage.getItem('clienteLaBella');
    const h = localStorage.getItem('horarioEscolhido');
    const carrinho = localStorage.getItem('cartLaBella');

    if (c) setCliente(JSON.parse(c));
    if (h) setHorario(h);
    if (carrinho) setCart(JSON.parse(carrinho));
  }, []);

  const enviarWhatsApp = () => {
    if (!cliente || !cart.length) return;

    let mensagem = `🍝 *NOVO PEDIDO - LA BELLA GRATTIA*\n\n`;
    mensagem += `👤 ${cliente.name}\n`;
    mensagem += `📱 ${cliente.phone}\n`;
    mensagem += `📍 ${cliente.address}\n`;
    mensagem += `⏰ ${horario}\n\n`;

    let total = 0;

    cart.forEach((item: any, i: number) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      mensagem += `${i + 1}. ${item.name} x${item.quantity}\n`;
    });

    mensagem += `\n💰 Total: R$ ${total.toFixed(2)}`;

    const url = `https://api.whatsapp.com/send?phone=5511945925632&text=${encodeURIComponent(
      mensagem
    )}`;

    window.location.href = url;
  };

  if (!cliente) return null;

  return (
    <div className="min-h-screen bg-[#0B0B10] text-white p-8">
      <div className="max-w-xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold">Revisar Pedido</h1>

        <div className="bg-[#141419] p-4 rounded">
          <p><strong>Nome:</strong> {cliente.name}</p>
          <p><strong>Telefone:</strong> {cliente.phone}</p>
          <p><strong>Endereço:</strong> {cliente.address}</p>
          <p><strong>Horário:</strong> {horario}</p>
        </div>

        <button
          onClick={enviarWhatsApp}
          className="w-full bg-[#7B2CFF] py-3 rounded font-semibold"
        >
          Confirmar e Enviar no WhatsApp
        </button>
      </div>
    </div>
  );
}
