import React from 'react';
import { ShoppingCart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  cartItems: CartItem[];
  cartTotal: number;
  itemCount: number;
  onUpdateQuantity: (dishId: string, quantity: number) => void;
  onRemoveItem: (dishId: string) => void;
  onCheckout: () => void;
  onOpenGallery?: () => void;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export function Header({
  cartItems,
  cartTotal,
  itemCount,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onOpenGallery,
}: HeaderProps) {
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="h-6 w-6" />
          <span className="font-bold text-xl">Bella Gratia</span>
        </div>

        <div className="flex items-center gap-4">
          {onOpenGallery && (
            <Button variant="ghost" onClick={onOpenGallery}>
              Galeria
            </Button>
          )}

          <Button
            variant="outline"
            className="relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsCartOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Seu Pedido</h2>
              <Button variant="ghost" onClick={() => setIsCartOpen(false)}>
                Fechar
              </Button>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-gray-500">Carrinho vazio</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity}x R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-4">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">R$ {cartTotal.toFixed(2)}</span>
                  </div>
                  <Button className="w-full" onClick={onCheckout}>
                    Finalizar Pedido
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}