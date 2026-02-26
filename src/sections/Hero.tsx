import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

// ✅ IMPORTS DAS IMAGENS (caminho absoluto via alias @)
import heroBg from '@/assets/hero_kitchen.jpg';
import logoImg from '@/assets/log.png';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onViewMenu: () => void;
}

export function Hero({ onViewMenu }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const microcopyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const headline = headlineRef.current;
    const subline = sublineRef.current;
    const cta = ctaRef.current;
    const microcopy = microcopyRef.current;

    if (!section || !bg || !headline || !subline || !cta || !microcopy) return;

    const ctx = gsap.context(() => {
      // Load animation
      const loadTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      loadTl
        .fromTo(bg, { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.1 })
        .fromTo(
          headline.querySelectorAll('.word'),
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.03, duration: 0.9 },
          '-=0.7'
        )
        .fromTo(subline, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.5')
        .fromTo([cta, microcopy], { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3');

      // Scroll animation (exit only)
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onLeaveBack: () => {
            gsap.set([headline, subline, cta, microcopy], { opacity: 1, y: 0 });
            gsap.set(bg, { scale: 1, y: 0 });
          },
        },
      });

      scrollTl
        .fromTo(
          contentRef.current,
          { y: 0, opacity: 1 },
          { y: '-22vh', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(bg, { scale: 1, y: 0 }, { scale: 1.1, y: '-6vh' }, 0.7)
        .fromTo([cta, microcopy], { opacity: 1 }, { opacity: 0 }, 0.7);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-pinned z-10"
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0"
        style={{ opacity: 0 }}
      >
        {/* ✅ Imagem importada via módulo (caminho resolvido pelo Vite) */}
        <img
          src={heroBg}
          alt="Dark Kitchen"
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Erro ao carregar hero_kitchen.jpg');
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.style.backgroundColor = 'hsl(var(--background))';
          }}
        />
        <div className="vignette" />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 w-full h-full flex flex-col items-center justify-center"
      >
        
        {/* ✅ Logo importado via módulo */}
        <div className="w-full flex justify-center mb-8">
          <img
            src={logoImg}
            alt="La Bella Gratia Logo"
            className="h-24 w-auto object-contain"
            onError={(e) => {
              console.error('Erro ao carregar log.png');
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
        
        {/* Headline Block */}
        <div className="text-center px-6" style={{ maxWidth: '1100px' }}>
          <h1
            ref={headlineRef}
            className="text-[clamp(44px,6vw,84px)] font-black text-[#F4F6FA] tracking-[0.02em] mb-4"
          >
            <span className="word inline-block">LA</span>{' '}
            <span className="word inline-block">BELLA</span>{' '}
            <span className="word inline-block">GRATIA</span>
          </h1>
          <p
            ref={sublineRef}
            className="text-[clamp(16px,2vw,24px)] text-[#A7ACB8] font-light tracking-wide"
          >
            Saborosa Comida Caseira. Delivery de Sábado.
          </p>
        </div>

        {/* Bottom Row */}
        <div className="absolute bottom-[7vh] left-0 right-0 px-[6vw] flex justify-between items-end">
          <div ref={microcopyRef} className="max-w-[34vw]">
            <p className="text-sm text-[#A7ACB8]">
              Pedidos de segunda a sexta. Retirada aos sábados.
            </p>
          </div>

          <div ref={ctaRef}>
            <button 
              onClick={onViewMenu} 
              className="btn-primary flex items-center gap-2"
            >
              Ver o menu desta Semana
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-[3vh] left-1/2 -translate-x-1/2 opacity-35">
          <div className="w-px h-8 bg-gradient-to-b from-[#F4F6FA] to-transparent" />
        </div>
      </div>
    </section>
  );
}