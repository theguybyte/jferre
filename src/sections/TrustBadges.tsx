import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BadgeCheck, Truck, RefreshCw } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const trustItems = [
  {
    icon: BadgeCheck,
    title: 'Plata 925 Certificada',
    description: 'Materiales de la más alta calidad',
  },
  {
    icon: Truck,
    title: 'Envíos a Todo el País',
    description: 'Entrega segura y rápida',
  },
  {
    icon: RefreshCw,
    title: 'Cambios y Garantía',
    description: '30 días para cambios',
  },
];

export function TrustBadges() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = itemsRef.current?.querySelectorAll('.trust-item');
      if (items) {
        ScrollTrigger.create({
          trigger: itemsRef.current,
          start: 'top 85%',
          onEnter: () => {
            gsap.fromTo(
              items,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.7,
                ease: 'power3.out',
                stagger: 0.15,
              }
            );
          },
          once: true,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-20 bg-[#F7F3EF]"
    >
      <div className="max-w-5xl mx-auto px-8 md:px-16">
        <div 
          ref={itemsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8"
        >
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="trust-item flex flex-col items-center text-center opacity-0"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                  <Icon 
                    className="w-5 h-5 text-[#D4AF37]" 
                    strokeWidth={1.5} 
                  />
                </div>
                <h3 className="text-sm font-display text-[#1A1A1A] mb-1">
                  {item.title}
                </h3>
                <p className="text-[11px] font-sans text-[#6B6B6B]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
