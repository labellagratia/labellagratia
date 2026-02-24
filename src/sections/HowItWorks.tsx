import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, ChefHat, Package } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'ESCOLHA',
    description: 'Pratos definidos na segunda, pedidos podem ser feitos até as 20hs da sexta-feira. Menu novo toda semana.',
    icon: Calendar,
  },
  {
    number: '02',
    title: 'PREPARO',
    description: 'Cozinhamos no sábado com entregas em diversos horários entre 11h00 e 15h00,  OBSERVAÇÃO: Informe sempre o horário que pretende receber o pedido.',
    icon: ChefHat,
  },
  {
    number: '03',
    title: 'RETIRADA',
    description: 'Você busca no endereço informado, ou solicita a entrega pelo seu app de delivery favorito.',
    icon: Package,
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current;
    const line = lineRef.current;

    if (!section || !heading || !cards || !line) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        heading,
        { y: 30, opacity: 0 },
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

      // Line animation
      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 40%',
            scrub: 0.4,
          },
        }
      );

      // Cards animation
      const cardElements = cards.querySelectorAll('.step-card');
      gsap.fromTo(
        cardElements,
        { y: '10vh', opacity: 0, rotateX: 12 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            end: 'top 20%',
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
      id="como-funciona"
      className="relative z-30 bg-[#141419] py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-12">
          <span className="label-mono mb-4 block">Processo</span>
          <h2 className="text-[clamp(34px,4.2vw,64px)] text-[#F4F6FA] mb-4">
            COMO FUNCIONA
          </h2>
          <p className="text-[#A7ACB8] text-lg max-w-md mx-auto">
            Três passos para levar o sabor para casa.
          </p>
        </div>

        {/* Decorative Line */}
        <div
          ref={lineRef}
          className="w-24 h-px bg-gradient-to-r from-transparent via-[#7B2CFF] to-transparent mx-auto mb-12 origin-center"
        />

        {/* Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="step-card min-h-[44vh] p-8 rounded-[28px] border border-[rgba(244,246,250,0.08)] bg-[#0B0B10]/50 hover:border-[rgba(123,44,255,0.3)] hover:bg-[#0B0B10] transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(123,44,255,0.15)] flex items-center justify-center group-hover:bg-[#7B2CFF] transition-colors">
                    <Icon className="w-6 h-6 text-[#7B2CFF] group-hover:text-[#0B0B10] transition-colors" />
                  </div>
                  <span className="font-mono text-3xl font-bold text-[#7B2CFF]">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#F4F6FA] mb-4">
                  {step.title}
                </h3>
                <p className="text-[#A7ACB8] leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
