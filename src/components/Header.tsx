import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { CartDrawer } from './CartDrawer';

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
  onOpenGallery?: () => void;
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartSheetOpen, setCartSheetOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // ✅ Debug: veja no console se está detectando scroll
      // console.log('Scroll Y:', window.scrollY, 'IsScrolled:', window.scrollY > 50);
      setIsScrolled(window.scrollY > 50); // ✅ Reduzido para 50px para testar
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // ✅ Chama uma vez ao montar para garantir estado inicial
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
    <header
      // ✅ Usa CSS variables + fallback inline style
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-header-scrolled backdrop-blur-md border-b border-header-border'
          : 'bg-transparent'
      }`}
      style={{
        backgroundColor: isScrolled 
          ? 'rgba(11, 11, 16, 0.9)' 
          : 'transparent'
      }}
    >
      <div className="w-full px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            className="font-['Montserrat'] font-bold text-lg lg:text-xl text-header-text tracking-wide hover:text-header-accent transition-colors"
          >
            La Bella Grattia
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('menu')}
              className="text-sm text-header-text-muted hover:text-header-text transition-colors"
            >
              Menu
            </button>
            <button
              onClick={() => scrollToSection('como-funciona')}
              className="text-sm text-header-text-muted hover:text-header-text transition-colors"
            >
              Como Funciona
            </button>
            {onOpenGallery && (
              <button
                onClick={onOpenGallery}
                className="text-sm text-header-text-muted hover:text-header-text transition-colors"
              >
                Galeria
              </button>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            
            {/* Cart */}
            <Sheet open={cartSheetOpen} onOpenChange={setCartSheetOpen}>
              <SheetTrigger asChild>
                <button className="relative p-2 text-header-text hover:text-header-accent transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-header-accent text-[#0B0B10] text-xs font-bold rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-full sm:max-w-md bg-[#141419] border-l border-[rgba(123,44,255,0.22)]"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-[#F4F6FA]">Seu Pedido</h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setCartSheetOpen(false)}
                    className="text-[#A7ACB8] hover:text-[#F4F6FA]"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
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

            {/* Finalizar Pedido (Desktop) */}
            <button
              onClick={() => scrollToSection('reservar')}
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 bg-header-accent text-[#0B0B10] font-medium rounded-lg hover:bg-[#6a23e0] transition-colors text-sm"
            >
              Finalizar Pedido
            </button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden p-2 text-header-text hover:text-header-accent transition-colors">
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
                    className="text-left text-lg text-header-text hover:text-header-accent transition-colors"
                  >
                    Menu
                  </button>
                  <button
                    onClick={() => scrollToSection('como-funciona')}
                    className="text-left text-lg text-header-text hover:text-header-accent transition-colors"
                  >
                    Como Funciona
                  </button>
                  {onOpenGallery && (
                    <button
                      onClick={onOpenGallery}
                      className="text-left text-lg text-header-text hover:text-header-accent transition-colors"
                    >
                      Galeria
                    </button>
                  )}
                  <hr className="border-[rgba(244,246,250,0.1)]" />
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