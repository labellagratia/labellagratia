// src/App.tsx
import { useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from '@/components/Header';
import { Hero } from '@/sections/Hero';
import { HowItWorks } from '@/sections/HowItWorks';
// ✅ Gallery mantida, mas NÃO renderizada no fluxo principal
import { Gallery } from '@/sections/Gallery';
import { Footer } from '@/sections/Footer';
import { useCart } from '@/hooks/useCart';
import { useMenu } from '@/hooks/useMenu';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import type { Dish } from '@/types';
import { MenuCheckout } from '@/components/MenuCheckout';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const { menu, isOrderingOpen } = useMenu();
  
  // ✅ Estado para controlar o modal da Gallery
  const [showGallery, setShowGallery] = useState(false);

  // Global scroll snap for pinned sections
  useEffect(() => {
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(
              r => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            if (!inPinned) return value;
            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = useCallback(
    (dish: Dish) => {
      if (!isOrderingOpen()) {
        toast.error('Pedidos encerrados para esta semana');
        return;
      }
      addItem(dish);
      toast.success(`${dish.name} adicionado ao carrinho`);
    },
    [addItem, isOrderingOpen]
  );

  const scrollToMenu = useCallback(() => {
    const el = document.getElementById('menu');
    el?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="relative bg-[#0B0B10] min-h-screen">
      {/* Grain Overlay */}
      <div className="grain-overlay" />

      {/* Header - com botão para abrir a Gallery */}
      <Header
        cartItems={items}
        cartTotal={total}
        itemCount={itemCount}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={scrollToMenu}
        // ✅ Nova prop para abrir a gallery
        onOpenGallery={() => setShowGallery(true)}
      />

      {/* Main Content - Fluxo enxuto */}
      <main className="relative pb-24">
        <Hero onViewMenu={scrollToMenu} />
        <HowItWorks />
        
        {/* Menu Section */}
        <section id="menu" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#F4F6FA] mb-8">Cardápio da Semana</h2>
            
            {menu.dishes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menu.dishes.map(dish => (
                  <div key={dish.id} className="bg-[#141419] rounded-xl p-4 border border-[#2A2A35]">
                    <img 
                      src={dish.image} 
                      alt={dish.name} 
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-lg font-semibold text-[#F4F6FA]">{dish.name}</h3>
                    <p className="text-[#A7ACB8] text-sm mb-2">{dish.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[#7B2CFF] font-bold">R$ {dish.price.toFixed(2)}</span>
                      <button
                        onClick={() => handleAddToCart(dish)}
                        disabled={!dish.available || !isOrderingOpen()}
                        className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
                      >
                        {dish.available ? 'Adicionar' : 'Esgotado'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#A7ACB8] text-center py-12">Carregando cardápio...</p>
            )}
          </div>
        </section>

        {/* Checkout */}
        {items.length > 0 && (
          <section className="py-12 px-4 bg-[#141419]/50 border-t border-[#2A2A35]">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-[#F4F6FA] mb-2">
                🛒 Seu Pedido ({itemCount} itens)
              </h3>
              <p className="text-[#A7ACB8] mb-6">
                Total: <span className="text-[#7B2CFF] font-bold text-xl">R$ {total.toFixed(2)}</span>
              </p>
              
              <MenuCheckout 
                cartItems={items} 
                cartTotal={total} 
                onOrderSent={() => {
                  clearCart();
                  toast.success('Pedido enviado! Aguarde confirmação no WhatsApp.');
                }} 
              />
              
              <p className="text-[#A7ACB8] text-sm mt-4">
                {isOrderingOpen() 
                  ? '🟢 Pedidos abertos até sexta, 20h' 
                  : '🔴 Pedidos encerrados para esta semana'}
              </p>
            </div>
          </section>
        )}

        <Footer />
      </main>

      {/* ✅ Gallery Modal - Só aparece quando showGallery = true */}
      {showGallery && (
        <div className="fixed inset-0 z-[200] bg-[#0B0B10]/95 backdrop-blur-sm flex items-center justify-center p-4">
          <button 
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 text-[#A7ACB8] hover:text-[#F4F6FA] text-3xl"
          >
            ✕
          </button>
          <div className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Renderiza o componente Gallery dentro do modal */}
            <Gallery />
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#141419',
            border: '1px solid rgba(123,44,255,0.22)',
            color: '#F4F6FA',
          },
        }}
      />
    </div>
  );
}

export default App;