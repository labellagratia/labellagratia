// src/components/Header.tsx
import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'; // ✅ Adicionado SheetTitle
import { CartDrawer } from './CartDrawer';
import { ChefProfile } from './ChefProfile';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface HeaderProps {
  cartItems: CartItem[];
  cartTotal: number;
  itemCount: number;
  onUpdateQuantity: (dishId: string, quantity: number) => void;
  onRemoveItem: (dishId: string) => void;
  onCheckout: () => void;
}

export function Header({
  cartItems,
  cartTotal,
  itemCount,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartSheetOpen, setCartSheetOpen] = useState(false);
  const [chefProfileOpen, setChefProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0B0B10]/90 backdrop-blur-md border-b border-[#2A2A35]'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo */}
            <button
              onClick={() => scrollToSection('hero')}
              className="font-['Montserrat'] font-bold text-lg lg:text-xl text-[#F4F6FA] tracking-wide hover:text-[#7B2CFF] transition-colors"
            >
              La Bella Gratia
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('menu')}
                className="text-sm text-[#A7ACB8] hover:text-[#F4F6FA] transition-colors"
              >
                Menu
              </button>
              <button
                onClick={() => scrollToSection('como-funciona')}
                className="text-sm text-[#A7ACB8] hover:text-[#F4F6FA] transition-colors"
              >
                Como Funciona
              </button>
              <button
                onClick={() => setChefProfileOpen(true)}
                className="text-sm text-[#A7ACB8] hover:text-[#7B2CFF] transition-colors flex items-center gap-1"
              >
                <User className="w-4 h-4" />
                Sobre
              </button>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              
              {/* Cart - ✅ REMOVIDO o h2 duplicado */}
              <Sheet open={cartSheetOpen} onOpenChange={setCartSheetOpen}>
                <SheetTrigger asChild>
                  <button className="relative p-2 text-[#F4F6FA] hover:text-[#7B2CFF] transition-colors">
                    <ShoppingBag className="w-5 h-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#7B2CFF] text-[#0B0B10] text-xs font-bold rounded-full flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="w-full sm:max-w-md bg-[#141419] border-l border-[#2A2A35] p-0" // ✅ p-0 para o CartDrawer controlar o padding
                >
                  {/* ✅ SheetTitle para acessibilidade (visually hidden se necessário) */}
                  <SheetTitle className="sr-only">Carrinho de Compras</SheetTitle>
                  <CartDrawer
                    items={cartItems}
                    total={cartTotal}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemoveItem={onRemoveItem}
                    onCheckout={() => {
                      onCheckout();
                      setCartSheetOpen(false);
                    }}
                  />
                </SheetContent>
              </Sheet>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="lg:hidden p-2 text-[#F4F6FA] hover:text-[#7B2CFF] transition-colors">
                    <Menu className="w-5 h-5" />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full bg-[#141419] border-l border-[#2A2A35]"
                >
                  <div className="flex flex-col gap-6 mt-8">
                    <button
                      onClick={() => { scrollToSection('menu'); setMobileMenuOpen(false); }}
                      className="text-left text-lg text-[#F4F6FA] hover:text-[#7B2CFF] transition-colors"
                    >
                      Menu
                    </button>
                    <button
                      onClick={() => { scrollToSection('como-funciona'); setMobileMenuOpen(false); }}
                      className="text-left text-lg text-[#F4F6FA] hover:text-[#7B2CFF] transition-colors"
                    >
                      Como Funciona
                    </button>
                    <button
                      onClick={() => { setChefProfileOpen(true); setMobileMenuOpen(false); }}
                      className="text-left text-lg text-[#F4F6FA] hover:text-[#7B2CFF] transition-colors flex items-center gap-2"
                    >
                      <User className="w-5 h-5" />
                      Sobre a Cozinheira
                    </button>
                    <hr className="border-[#2A2A35]" />
                    <button
                      onClick={() => { onCheckout(); setMobileMenuOpen(false); }}
                      className="btn-primary text-center"
                    >
                      Finalizar Pedido
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* ✅ ChefProfile - O X duplicado deve ser corrigido no ChefProfile.tsx */}
      <ChefProfile 
        open={chefProfileOpen} 
        onOpenChange={setChefProfileOpen} 
      />
    </>
  );
}