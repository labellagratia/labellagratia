import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, ChefHat, Package, User, Heart, Award, Flame } from 'lucide-react';

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
    description: 'Cozinhamos no sábado com entregas em diversos horários entre 11h00 e 15h00. Informe sempre o horário que pretende receber o pedido.',
    icon: ChefHat,
  },
  {
    number: '03',
    title: 'RETIRADA',
    description: 'Você busca no endereço informado, ou solicita a entrega pelo seu app de delivery favorito.',
    icon: Package,
  },
];

const chefHighlights = [
  {
    icon: Heart,
    title: 'Tradição',
    description: 'Cozinha familiar brasileira com toque contemporâneo',
  },
  {
    icon: Flame,
    title: 'Especialidades',
    description: 'Pratos de panela, assados e gratinados',
  },
  {
    icon: Award,
    title: 'Experiência',
    description: 'Rotisserie, buffet, à la carte e eventos',
  },
];

type TabType = 'como-funciona' | 'chef';

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState<TabType>('como-funciona');
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const content = contentRef.current;
    const line = lineRef.current;
    const bg = bgRef.current;

    if (!section || !heading || !content || !line || !bg) return;

    const ctx = gsap.context(() => {
      // Background image animation
      gsap.fromTo(
        bg,
        { opacity: 0, scale: 1.1 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          delay: 0.3,
          ease: 'power2.out',
        }
      );

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
    }, section);

    return () => ctx.revert();
  }, []);

  // Animação ao trocar tab
  useEffect(() => {
    if (!contentRef.current) return;
    
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, [activeTab]);

  return (
    <section
      ref={sectionRef}
      id="como-funciona"
      className="relative z-30 py-20 lg:py-28 overflow-hidden"
    >
      {/* Background Image */}
      <div 
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/como.jpg')" }}
      />
      <div className="absolute inset-0 bg-[#141419]/90" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Tabs Navigation */}
        <div ref={headingRef} className="text-center mb-8">
          <div className="inline-flex p-1 bg-[#0B0B10]/80 backdrop-blur-sm rounded-2xl border border-[rgba(244,246,250,0.1)] mb-8">
            <button
              onClick={() => setActiveTab('como-funciona')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'como-funciona'
                  ? 'bg-[#7B2CFF] text-[#0B0B10]'
                  : 'text-[#A7ACB8] hover:text-[#F4F6FA]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Como Funciona</span>
              <span className="sm:hidden">Processo</span>
            </button>
            <button
              onClick={() => setActiveTab('chef')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'chef'
                  ? 'bg-[#7B2CFF] text-[#0B0B10]'
                  : 'text-[#A7ACB8] hover:text-[#F4F6FA]'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Conheça a Chef</span>
              <span className="sm:hidden">A Chef</span>
            </button>
          </div>

          {/* Título dinâmico */}
          <h2 className="text-[clamp(28px,4.2vw,64px)] text-[#F4F6FA] mb-4">
            {activeTab === 'como-funciona' ? 'COMO FUNCIONA' : 'CONHEÇA A CHEF'}
          </h2>
          <p className="text-[#A7ACB8] text-lg max-w-md mx-auto">
            {activeTab === 'como-funciona'
              ? '3 passos para levar o sabor para a sua casa.'
              : 'Patricia de Fátima transforma ingredientes simples em experiências memoráveis.'}
          </p>
        </div>

        {/* Decorative Line */}
        <div
          ref={lineRef}
          className="w-24 h-px bg-gradient-to-r from-transparent via-[#7B2CFF] to-transparent mx-auto mb-12 origin-center"
        />

        {/* Content */}
        <div ref={contentRef}>
          {activeTab === 'como-funciona' ? (
            /* Cards Grid - Como Funciona */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
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
          ) : (
            /* Chef Profile Content */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Foto da Chef */}
              <div className="relative order-2 lg:order-1">
                <div className="relative aspect-[4/5] max-w-md mx-auto lg:max-w-none rounded-[28px] overflow-hidden shadow-2xl border border-[rgba(123,44,255,0.2)]">
                  <img
                    src="/chef-photo.jpeg"
                    alt="Patricia de Fátima - Chef La Bella Gratia"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B10]/60 via-transparent to-transparent" />
                </div>

                {/* Badge flutuante */}
                <div className="absolute -bottom-4 -right-4 lg:bottom-8 lg:-right-4 bg-[#141419] border border-[#7B2CFF]/30 rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#7B2CFF]/20 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-[#7B2CFF]" />
                    </div>
                    <div>
                      <p className="text-[#F4F6FA] font-bold text-sm">Cozinha com Amor</p>
                      <p className="text-[#A7ACB8] text-xs">Desde a infância</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Texto e Highlights */}
              <div className="order-1 lg:order-2 space-y-6">
                <div className="space-y-4 text-[#A7ACB8] leading-relaxed">
                  <p className="text-lg">
                    Cozinhando desde a infância, Patricia acumula longa experiência gastronômica: 
                    <span className="text-[#F4F6FA]"> rotisserie, buffet, à la carte e eventos variados</span>.
                  </p>
                  <p>
                    Especialista em comida caseira brasileira com toque contemporâneo, 
                    ela transforma ingredientes simples em experiências memoráveis.
                  </p>
                </div>

                {/* Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {chefHighlights.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="bg-[#0B0B10]/50 border border-[rgba(244,246,250,0.08)] rounded-xl p-4 hover:border-[rgba(123,44,255,0.3)] transition-colors group"
                      >
                        <Icon className="w-6 h-6 text-[#7B2CFF] mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-[#F4F6FA] font-semibold text-sm mb-1">
                          {item.title}
                        </h3>
                        <p className="text-[#A7ACB8] text-xs leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Quote */}
                <div className="bg-[rgba(123,44,255,0.1)] border border-[rgba(123,44,255,0.2)] rounded-xl p-4">
                  <p className="text-[#F4F6FA] text-sm italic">
                    "Cada prato é preparado como se fosse para minha própria família."
                  </p>
                  <p className="text-[#7B2CFF] text-xs font-bold mt-2">
                    — Patricia de Fátima
                  </p>
                </div>

                {/* CTA */}
                <a 
                  href="#menu" 
                  className="inline-flex items-center gap-2 text-[#7B2CFF] hover:text-[#9B4CFF] transition-colors font-semibold text-sm"
                >
                  Experimente o cardápio desta semana
                  <span>→</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}