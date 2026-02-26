import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, MapPin, ChefHat } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    const content = contentRef.current;

    if (!section || !line || !content) return;

    const ctx = gsap.context(() => {
      // Line animation
      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            end: 'top 70%',
            scrub: 0.4,
          },
        }
      );

      // Content animation
      gsap.fromTo(
        content.querySelectorAll('.footer-item'),
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'top 60%',
            scrub: 0.4,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={sectionRef}
      className="relative z-[80] bg-[#0B0B10] pt-16 pb-8"
    >
      {/* Top Border Line with gradient */}
      <div
        ref={lineRef}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7B2CFF]/50 to-transparent origin-center"
      />

      <div ref={contentRef} className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Main Grid - 3 colunas em desktop, empilhado em mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-12">
          
          {/* Coluna 1: Brand */}
          <div className="footer-item text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#7B2CFF]/20 flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-[#7B2CFF]" />
              </div>
              <h3 className="font-['Montserrat'] font-bold text-xl text-[#F4F6FA]">
                La Bella Gratia
              </h3>
            </div>
            <p className="text-[#A7ACB8] text-sm leading-relaxed mb-4">
              O Seu Menu de Sábado.<br />
            </p>
             </div>

          {/* Coluna 2: Horários */}
          <div className="footer-item">
            <h4 className="font-semibold text-[#F4F6FA] mb-5 flex items-center justify-center md:justify-start gap-2">
              <Clock className="w-4 h-4 text-[#7B2CFF]" />
              Funcionamento
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-center sm:text-left">
                <span className="text-[#A7ACB8]">Pedidos Online:</span>
                <span className="text-[#F4F6FA] font-medium">de Segunda a Sexta</span>
              </div>
               <div className="pt-2 mt-2 border-t border-[rgba(244,246,250,0.08)]">
                <p className="text-[#7B2CFF] text-xs font-medium text-center sm:text-left">
                  ⚠️ Pedidos até sexta, 20h
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-center sm:text-left">
                <span className="text-[#A7ACB8]">Retirada/Entrega:</span>
                <span className="text-[#F4F6FA] font-medium">aos Sábados · 11h–15h</span>
              </div>
            </div>
          </div>

          {/* Coluna 3: Localização */}
          <div className="footer-item">
            <h4 className="font-semibold text-[#F4F6FA] mb-5 flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4 text-[#7B2CFF]" />
              Localização
            </h4>
            <div className="space-y-3 text-sm text-center md:text-left">
              <p className="text-[#A7ACB8]">
                Endereço informado no momento do pedido.
              </p>
              <div className="bg-[#141419] rounded-lg p-3 border border-[rgba(244,246,250,0.08)]">
                <p className="text-[#F4F6FA] text-xs font-medium mb-1">
                  🚚 Opções de Entrega:
                </p>
                <ul className="text-[#A7ACB8] text-xs space-y-1">
                  <li>• Retirar de forma presencial</li>
                  <li>• Contratar um App de delivery</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[rgba(244,246,250,0.08)] mb-8" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-[#6B7280] text-xs">
            © {new Date().getFullYear()} La Bella Gratia. Todos os direitos reservados.
            <li> Site desenvolvido por Gustavo Tovo.</li>
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-[#6B7280] text-xs">
            <span>Pagamento antecipado</span>
            <span className="hidden sm:inline">•</span>
            <span>Entrega não inclusa</span>
          </div>
        </div>
      </div>
    </footer>
  );
}