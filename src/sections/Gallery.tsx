import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const galleryImages = [
  { src: '/gallery_01.jpg', alt: 'Risotto Negro' },
  { src: '/gallery_02.jpg', alt: 'Pappardelle' },
  { src: '/gallery_03.jpg', alt: 'Sobremesa' },
];

export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const label = labelRef.current;
    const cards = cardsRef.current;

    if (!section || !label || !cards) return;

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

      const cardElements = cards.querySelectorAll('.gallery-card');

      // ENTRANCE (0-30%)
      scrollTl
        .fromTo(label, { y: -12, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0)
        .fromTo(
          cardElements[0],
          { x: '-60vw', opacity: 0, rotateY: -10 },
          { x: 0, opacity: 1, rotateY: 0, ease: 'none' },
          0
        )
        .fromTo(
          cardElements[1],
          { y: '70vh', opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, ease: 'none' },
          0.08
        )
        .fromTo(
          cardElements[2],
          { x: '60vw', opacity: 0, rotateY: 10 },
          { x: 0, opacity: 1, rotateY: 0, ease: 'none' },
          0.12
        );

      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      scrollTl
        .fromTo(
          cardElements[0],
          { x: 0, opacity: 1 },
          { x: '-18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          cardElements[1],
          { y: 0, opacity: 1 },
          { y: '14vh', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          cardElements[2],
          { x: 0, opacity: 1 },
          { x: '18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(label, { opacity: 1 }, { opacity: 0 }, 0.75);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="galeria"
      className="section-pinned z-50 bg-[#0B0B10]"
    >
      {/* Label */}
      <div
        ref={labelRef}
        className="absolute top-[8vh] left-1/2 -translate-x-1/2 z-10"
      >
        <span className="label-mono">Galeria</span>
      </div>

      {/* Cards Container */}
      <div
        ref={cardsRef}
        className="absolute inset-0 flex items-center justify-center gap-[4vw] px-[7vw]"
      >
        {galleryImages.map((image, index) => (
          <div
            key={index}
            className="gallery-card w-[24vw] h-[68vh] rounded-[28px] overflow-hidden shadow-2xl group"
            style={{ perspective: '1000px' }}
          >
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B10]/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[#F4F6FA] font-semibold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {image.alt}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
