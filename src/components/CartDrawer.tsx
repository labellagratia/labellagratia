import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import type { CartItem } from '@/types';

interface CartDrawerProps {
  items: CartItem[];
  total: number;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export function CartDrawer({
  items,
  total,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <ShoppingBag className="w-16 h-16 text-[#A7ACB8] mb-4" />
        <h3 className="text-xl font-bold text-[#F4F6FA] mb-2">Seu carrinho está vazio</h3>
        <p className="text-[#A7ACB8] text-sm">
          Adicione pratos do menu deste sábado
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold text-[#F4F6FA] mb-6">Seu Pedido</h2>

      <div className="flex-1 overflow-auto space-y-4">
        {items.map(item => (
          <div
            key={item.id}
            className="flex gap-4 p-3 bg-[#0B0B10] rounded-xl border border-[rgba(244,246,250,0.08)]"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-[#F4F6FA] text-sm">{item.name}</h4>
              <p className="text-[#7B2CFF] font-bold text-sm mt-1">
                R$ {item.price.toFixed(2)}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center bg-[#141419] rounded-full text-[#F4F6FA] hover:bg-[#7B2CFF] hover:text-[#0B0B10] transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-[#F4F6FA] text-sm w-6 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center bg-[#141419] rounded-full text-[#F4F6FA] hover:bg-[#7B2CFF] hover:text-[#0B0B10] transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="ml-auto p-1.5 text-[#A7ACB8] hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[rgba(244,246,250,0.1)] pt-4 mt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[#A7ACB8]">Total</span>
          <span className="text-2xl font-bold text-[#7B2CFF]">
            R$ {total.toFixed(2)}
          </span>
        </div>
        <button onClick={onCheckout} className="w-full btn-primary">
          Finalizar Pedido
        </button>
        <p className="text-xs text-[#A7ACB8] text-center mt-3">
          Entrega não inclusa — retirada no bairro
        </p>
      </div>
    </div>
  );
}
