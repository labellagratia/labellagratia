// src/App.tsx
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from '@/components/Header';
import { Hero } from '@/sections/Hero';
import { HowItWorks } from '@/sections/HowItWorks';
import { Footer } from '@/sections/Footer';
import { MenuSection } from '@/sections/MenuSection';
import { useCart } from '@/hooks/useCart';
import { useMenu } from '@/hooks/useMenu';
import { Toaster } from '@/components/ui/sonner';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  const { isOrderingOpen } = useMenu();

  const orderingOpen = typeof isOrderingOpen === 'function'
    ? !!isOrderingOpen()
    : !!isOrderingOpen;

  // ✅ ScrollTrigger setup (mantido)
  useEffect(() => {
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars?.pin)
        .sort((a, b) => (a.start ?? 0) - (b.start ?? 0));
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: (st.start ?? 0) / maxScroll,
        end: (st.end ?? st.start ?? 0) / maxScroll,
        center: ((st.start ?? 0) + (((st.end ?? st.start ?? 0) - (st.start ?? 0)) * 0.5)) / maxScroll,
      }));

      const existingSnap = ScrollTrigger.getAll().find(st => st.vars?.snap);
      if (!existingSnap) {
        ScrollTrigger.create({
          snap: {
            snapTo: (value: number) => {
              const inPinned = pinnedRanges.some(
                r => value >= (r.start - 0.02) && value <= (r.end + 0.02)
              );
              if (!inPinned) return value;
              return pinnedRanges.reduce(
                (closest, r) =>
                  Math.abs((r.center ?? 0) - value) < Math.abs(closest - value)
                    ? (r.center ?? 0)
                    : closest,
                pinnedRanges[0]?.center ?? 0
              );
            },
            duration: { min: 0.15, max: 0.35 },
            delay: 0,
            ease: 'power2.out',
          },
        });
      }
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll()
        .filter(st => st.vars?.snap && !st.vars.trigger)
        .forEach(st => st.kill());
    };
  }, []);

  // ✅ scrollToMenu (função direta, não useCallback)
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative bg-[#0B0B10] min-h-screen text-[#F4F6FA]">
      <div className="grain-overlay pointer-events-none fixed inset-0 z-0 opacity-[0.03]" />

      <Header
        cartItems={items}
        cartTotal={total}
        itemCount={itemCount}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={scrollToMenu}
      />

      <main className="relative z-10">
        <Hero onViewMenu={scrollToMenu} />
        <HowItWorks />
        
        {/* ✅ MenuSection com checkout interno */}
        <MenuSection isOrderingOpen={orderingOpen} />

        <Footer />
      </main>

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