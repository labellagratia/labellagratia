import { useState, useEffect } from 'react';
import { ShoppingBag, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CartDrawer } from './CartDrawer';
import type { CartItem } from '@/types';

interface HeaderProps {
  cartItems: CartItem[];
  cartTotal: number;
  itemCount: number;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0B10]/90 backdrop-blur-md border-b border-[rgba(123,44,255,0.15)]'
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
            La Bella Grattia
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
              onClick={() => scrollToSection('galeria')}
              className="text-sm text-[#A7ACB8] hover:text-[#F4F6FA] transition-colors"
            >
              Galeria
            </button>
            {/* ✅ "Reservar" removido do menu central */}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Sheet>
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
              <SheetContent className="w-full sm:max-w-md bg-[#141419] border-l border-[rgba(123,44,255,0.22)]">
                <CartDrawer
                  items={cartItems}
                  total={cartTotal}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemoveItem={onRemoveItem}
                  onCheckout={onCheckout}
                />
              </SheetContent>
            </Sheet>

            {/* ✅ Finalizar Pedido Button (Desktop) */}
            <button
              onClick={() => scrollToSection('reservar')}
              className="hidden lg:block btn-primary text-sm"
            >
              Finalizar Pedido
            </button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden p-2 text-[#F4F6FA]">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full bg-[#0B0B10] border-l border-[rgba(123,44,255,0.22)]"
              >
                <div className="flex flex-col gap-6 mt-8">
                  <button
                    onClick={() => scrollToSection('menu')}
                    className="text-left text-lg text-[#F4F6FA] hover:text-[#7B2CFF] transition-colors"
                  >
                    Menu
                  </button>
                  <button
                    onClick={() => scrollToSection('como-funciona')}
                    className="text-left text-lg text-[#F4F6FA] hover:text-[#7B2CFF] transition-colors"
                  >
                    Como Funciona
                  </button>
                  <button
                    onClick={() => scrollToSection('galeria')}
                    className="text-left text-lg text-[#F4F6FA] hover:text-[#7B2CFF] transition-colors"
                  >
                    Galeria
                  </button>
                  <hr className="border-[rgba(244,246,250,0.1)]" />
                  {/* ✅ Mobile button corrigido */}
                  <button
                    onClick={() => scrollToSection('reservar')}
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
  );
}