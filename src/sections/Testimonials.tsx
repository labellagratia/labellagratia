import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: 'Rafaela M.',
    text: 'Parece restaurante fine dining. Mas é a minha casa.',
    avatar: 'RM',
  },
  {
    name: 'Diego T.',
    text: 'A massa vem perfeita para finalizar em 3 minutos.',
    avatar: 'DT',
  },
];

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current;

    if (!section || !heading || !cards) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        heading,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 0.4,
          },
        }
      );

      // Cards animation
      const cardElements = cards.querySelectorAll('.testimonial-card');
      gsap.fromTo(
        cardElements,
        { y: '8vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 0.4,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-[60] bg-[#0B0B10] py-20 lg:py-28"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-12">
          <span className="label-mono mb-4 block">Depoimentos</span>
          <h2 className="text-[clamp(34px,4.2vw,64px)] text-[#F4F6FA]">
            QUEM EXPERIMENTOU
          </h2>
        </div>

        {/* Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card p-8 rounded-[28px] border border-[rgba(244,246,250,0.08)] bg-[#141419] hover:border-[rgba(123,44,255,0.2)] transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-[#7B2CFF] mb-4 opacity-50" />
              <p className="text-[#F4F6FA] text-lg leading-relaxed mb-6">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7B2CFF] to-[#4169E1] flex items-center justify-center">
                  <span className="text-[#0B0B10] font-bold text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                <span className="text-[#A7ACB8] font-medium">{testimonial.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
