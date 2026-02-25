import { useState } from 'react';
import { mockMenu } from '@/data/mockMenu';
import { Button } from '@/components/ui/button';
import { MenuCheckout } from '@/components/MenuCheckout';
import type { MenuItem } from '@/types/menu';
import type { CartItem } from '@/types';

export function MenuSection() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);

  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i);
      }
      // ✅ Correção: Mapear MenuItem para CartItem
      return [...prev, {
        id: item.id,
        name: item.nome,
        price: item.preco,
        quantity: 1
      }];
    });
    setCartTotal(prev => prev + item.preco);
  };

  const handleOrderSent = () => {
    console.log('Pedido enviado!');
    setCartItems([]);
    setCartTotal(0);
  };

  return (
    <section id="menu" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Cardápio da Semana</h2>
        <p className="text-center text-muted-foreground mb-12">
          Pedidos de segunda a sexta. Retirada aos sábados.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockMenu.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-lg shadow-lg overflow-hidden border border-border"
            >
              {item.imagemUrl && (
                <img
                  src={item.imagemUrl}
                  alt={item.nome}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{item.nome}</h3>
                <p className="text-muted-foreground mb-4">{item.descricao}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">
                    R$ {item.preco.toFixed(2)}
                  </span>
                  {item.disponivel ? (
                    <Button onClick={() => addToCart(item)}>Pedir</Button>
                  ) : (
                    <Button variant="outline" disabled>
                      Indisponível
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {cartItems.length > 0 && (
          <div className="mt-12 p-6 bg-card rounded-lg border border-border max-w-md mx-auto">
            <h3 className="text-xl font-bold mb-4 text-foreground">Seu Pedido</h3>
            <ul className="space-y-2 mb-4">
              {cartItems.map(item => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p className="text-lg font-bold text-primary mb-4">
              Total: R$ {cartTotal.toFixed(2)}
            </p>
            <MenuCheckout
              cartItems={cartItems}
              cartTotal={cartTotal}
              onOrderSent={handleOrderSent}
              onCartClear={() => {
                setCartItems([]);
                setCartTotal(0);
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}