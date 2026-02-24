import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftImageRef = useRef<HTMLDivElement>(null);
  const rightImageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const leftImage = leftImageRef.current;
    const rightImage = rightImageRef.current;
    const card = cardRef.current;
    const quote = quoteRef.current;

    if (!section || !leftImage || !rightImage || !card || !quote) return;

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

      // ENTRANCE (0-30%)
      scrollTl
        .fromTo(
          leftImage,
          { x: '-70vw', opacity: 0, scale: 1.05 },
          { x: 0, opacity: 1, scale: 1, ease: 'none' },
          0
        )
        .fromTo(
          rightImage,
          { x: '70vw', opacity: 0, scale: 1.05 },
          { x: 0, opacity: 1, scale: 1, ease: 'none' },
          0.05
        )
        .fromTo(
          card,
          { y: '60vh', opacity: 0, rotate: 1.5 },
          { y: 0, opacity: 1, rotate: 0, ease: 'none' },
          0.1
        )
        .fromTo(
          quote,
          { y: '10vh', scale: 0.9, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, ease: 'none' },
          0.18
        );

      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      scrollTl
        .fromTo(leftImage, { x: 0, opacity: 1 }, { x: '-22vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(rightImage, { x: 0, opacity: 1 }, { x: '22vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(card, { y: 0, opacity: 1 }, { y: '18vh', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(quote, { opacity: 1 }, { opacity: 0 }, 0.75);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pinned z-40 bg-[#0B0B10]"
    >
      {/* Left Tall Image */}
      <div
        ref={leftImageRef}
        className="absolute left-[7vw] top-[12vh] w-[30vw] h-[76vh] rounded-[28px] overflow-hidden shadow-2xl"
      >
        <img
          src="/experience_hands.jpg"
          alt="cozinhando"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B10]/40 to-transparent" />
      </div>

      {/* Right Top Wide Image */}
      <div
        ref={rightImageRef}
        className="absolute right-[7vw] top-[12vh] w-[52vw] h-[34vh] rounded-[28px] overflow-hidden shadow-2xl"
      >
        <img
          src="/experience_oven.jpg"
          alt="Forno"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B10]/30 to-transparent" />
      </div>

      {/* Right Bottom Text Card */}
      <div
        ref={cardRef}
        className="absolute right-[7vw] top-[52vh] w-[52vw] h-[36vh] card-dark p-8 lg:p-10 flex flex-col justify-center"
      >
        <h2 className="text-[clamp(24px,2.5vw,40px)] text-[#F4F6FA] mb-4">
          FEITO À MÃO. COZIDO COM CALMA.
        </h2>
        <p className="text-[#A7ACB8] leading-relaxed mb-6 max-w-lg">
          Massa fresca, molhos lentos, ingredientes de proximidade. A experiência começa aqui.
        </p>
        <button
          onClick={() => {
            const el = document.getElementById('menu');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex items-center gap-2 text-[#7B2CFF] font-semibold hover:gap-3 transition-all"
        >
          Ver ingredientes
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quote Micro-card */}
      <div
        ref={quoteRef}
        className="absolute left-[26vw] top-[70vh] w-[18vw] min-h-[10vh] card-dark p-4 flex items-center justify-center"
      >
        <p className="font-mono text-sm text-[#7B2CFF] uppercase tracking-wider text-center">
          "Sabor de sábado."
        </p>
      </div>
    </section>
  );
}
