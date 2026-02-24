// src/sections/MenuSection.tsx
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus } from 'lucide-react';
import type { Dish } from '@/types';
import { MenuCheckout } from '@/components/MenuCheckout'; // ✅ Import do checkout

gsap.registerPlugin(ScrollTrigger);

interface MenuSectionProps {
  dishes: Dish[];
  onAddToCart: (dish: Dish) => void;
  weekNumber: number;
  // ✅ Props para o checkout integrado:
  cartItems: any[];
  cartTotal: number;
  onOrderSent?: () => void;
}

export function MenuSection({ 
  dishes, 
  onAddToCart, 
  weekNumber,
  cartItems,
  cartTotal,
  onOrderSent 
}: MenuSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const image = imageRef.current;
    const badge = badgeRef.current;
    const content = contentRef.current;

    if (!section || !card || !image || !badge || !content) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      scrollTl
        .fromTo(card, { x: '-60vw', opacity: 0, rotate: -2 }, { x: 0, opacity: 1, rotate: 0, ease: 'none' }, 0)
        .fromTo(image, { x: '60vw', opacity: 0, scale: 1.06 }, { x: 0, opacity: 1, scale: 1, ease: 'none' }, 0.05)
        .fromTo(content.querySelectorAll('.animate-item'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.03, ease: 'none' }, 0.1)
        .fromTo(badge, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none' }, 0.18)
        .fromTo(card, { x: 0, opacity: 1 }, { x: '-18vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(image, { x: 0, opacity: 1 }, { x: '18vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(content.querySelectorAll('.animate-item'), { y: 0, opacity: 1 }, { y: '-10vh', opacity: 0, stagger: 0.02, ease: 'power2.in' }, 0.7)
        .fromTo(badge, { opacity: 1 }, { opacity: 0 }, 0.75);
    }, section);

    return () => ctx.revert();
  }, []);

  const availableDishes = dishes.filter(d => d.available);

  return (
    <section
      ref={sectionRef}
      id="menu"
      className="section-pinned z-20 bg-[#0B0B10]"
      style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(123,44,255,0.1) 0%, transparent 50%)' }}
    >
      {/* Badge */}
      <div ref={badgeRef} className="absolute z-30 left-[11vw] top-[10vh]">
        <span className="bg-[#7B2CFF] text-[#0B0B10] font-mono text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
          Edição {weekNumber}
        </span>
      </div>

      {/* Menu Card */}
      <div ref={cardRef} className="absolute left-[7vw] top-[14vh] w-[40vw] h-[72vh] card-dark p-8 lg:p-10 flex flex-col">
        <div ref={contentRef}>
          <span className="label-mono mb-4 block animate-item">Menu deste sábado</span>
          <h2 className="text-[clamp(28px,3vw,48px)] text-[#F4F6FA] mb-8 animate-item">
            MENU DESTE SÁBADO
          </h2>

          {/* Lista de Pratos (com scroll interno se necessário) */}
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[45vh]">
            {availableDishes.map((dish, index) => (
              <div
                key={dish.id}
                className="animate-item group flex items-start justify-between gap-4 p-4 rounded-xl bg-[#0B0B10]/50 border border-[rgba(244,246,250,0.06)] hover:border-[rgba(123,44,255,0.3)] transition-all"
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-[#F4F6FA] mb-1 group-hover:text-[#7B2CFF] transition-colors">
                    {dish.name}
                  </h4>
                  <p className="text-sm text-[#A7ACB8] line-clamp-2">{dish.description}</p>
                  <p className="text-[#7B2CFF] font-bold mt-2">R$ {dish.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => onAddToCart(dish)}
                  className="w-10 h-10 flex items-center justify-center bg-[#7B2CFF] text-[#0B0B10] rounded-full hover:scale-110 transition-transform"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            ))}
            {availableDishes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-[#A7ACB8]">Nenhum prato disponível esta semana.</p>
              </div>
            )}
          </div>

          {/* ✅ CHECKOUT INTEGRADO - Aparece logo abaixo dos pratos */}
          <div className="mt-6 pt-6 border-t border-[rgba(244,246,250,0.1)] animate-item">
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {/* Resumo do carrinho */}
                <div className="flex justify-between items-center text-sm bg-[#0B0B10]/80 p-3 rounded-lg">
                  <span className="text-[#A7ACB8]">
                    🛒 {cartItems.length} item(ns)
                  </span>
                  <span className="text-[#7B2CFF] font-bold text-lg">
                    R$ {cartTotal.toFixed(2)}
                  </span>
                </div>
                
                {/* Componente de Checkout */}
                <MenuCheckout
                  cartItems={cartItems}
                  cartTotal={cartTotal}
                  onOrderSent={onOrderSent}
                />
                
                <p className="text-xs text-[#A7ACB8] text-center opacity-70">
                  Entrega via app ou retirada pessoal.
                </p>
              </div>
            ) : (
              <p className="text-[#A7ACB8] text-center text-sm italic opacity-70">
                Adicione itens para ver o resumo do pedido aqui.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Food Image */}
      <div
        ref={imageRef}
        className="absolute right-[7vw] top-[16vh] w-[40vw] h-[68vh] rounded-[28px] overflow-hidden shadow-2xl"
      >
        <img
          src="/menu_featured_dish.jpg"
          alt="Prato em destaque"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B10]/60 to-transparent" />
      </div>
    </section>
  );
}