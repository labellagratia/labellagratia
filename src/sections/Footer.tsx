import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Mail, Clock, MapPin } from 'lucide-react';

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
        content.querySelectorAll('.footer-col'),
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 50%',
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
      {/* Top Border Line */}
      <div
        ref={lineRef}
        className="absolute top-0 left-6 right-6 h-px bg-[rgba(244,246,250,0.08)] origin-left"
      />

      <div ref={contentRef} className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="footer-col">
            <h3 className="font-['Montserrat'] font-bold text-xl text-[#F4F6FA] mb-4">
              La Bella Grattia
            </h3>
            <p className="text-[#A7ACB8] text-sm leading-relaxed">
              Menu de sábado. 
            </p>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="font-semibold text-[#F4F6FA] mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#7B2CFF]" />
              Contato
            </h4>
            <p className="text-[#A7ACB8] text-sm mb-2">reservas@labellagrattia.com</p>
            <a
              href="https://instagram.com/labellagrattia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#A7ACB8] text-sm hover:text-[#7B2CFF] transition-colors"
            >
              <Instagram className="w-4 h-4" />
              @labellagrattia
            </a>
          </div>

          {/* Hours */}
          <div className="footer-col">
            <h4 className="font-semibold text-[#F4F6FA] mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#7B2CFF]" />
              Horários
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#A7ACB8]">Reservas:</span>
                <span className="text-[#F4F6FA]">Seg-Sex · On-line</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A7ACB8]">Retirada:</span>
                <span className="text-[#F4F6FA]">Sáb · 11h–15h</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="footer-col">
            <h4 className="font-semibold text-[#F4F6FA] mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#7B2CFF]" />
              Local
            </h4>
            <p className="text-[#A7ACB8] text-sm">
              Endereço informado no momento da reserva
            </p>
            <p className="text-[#7B2CFF] text-xs mt-2">
              Entrega não inclusa
            </p>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 border-t border-[rgba(244,246,250,0.08)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#A7ACB8] text-xs">
            © {new Date().getFullYear()} La Bella Grattia. Todos os direitos reservados.
          </p>
          <p className="text-[#A7ACB8] text-xs">
            Entrega não inclusa. Pagamento antecipado.
          </p>
        </div>
      </div>
    </footer>
  );
}
