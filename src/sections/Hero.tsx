import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { heroConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

export function Hero({ cartItemCount = 0, onCartClick }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);

  if (!heroConfig.backgroundText && !heroConfig.heroImage && heroConfig.navLinks.length === 0) return null;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Brand text subtle parallax
      const brandTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          if (brandRef.current) {
            gsap.set(brandRef.current, { 
              yPercent: self.progress * 30,
              opacity: 0.03 - (self.progress * 0.02)
            });
          }
        },
      });

      // Content fade in on load
      gsap.fromTo(
        contentRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.3 }
      );

      // Image reveal
      gsap.fromTo(
        imageRef.current,
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out', delay: 0.2 }
      );

      return () => {
        brandTrigger.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative min-h-screen w-full bg-[#F7F3EF] overflow-hidden"
    >
      {/* Subtle background text - very reduced and decorative */}
      <div
        ref={brandRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none will-change-transform"
      >
        <span className="text-[20vw] md:text-[15vw] font-display font-light text-[#1A1A1A] tracking-[0.15em] opacity-[0.03]">
          J. FERRÉ
        </span>
      </div>

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-8 md:px-16 py-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-[#1A1A1A] font-display text-xl tracking-[0.2em]">
            J. FERRÉ
          </div>

          {/* Desktop Navigation */}
          {heroConfig.navLinks.length > 0 && (
            <div className="hidden md:flex items-center gap-10">
              {heroConfig.navLinks.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  className="nav-link"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* Cart Icon */}
          <button 
            onClick={onCartClick}
            className="relative text-[#1A1A1A] hover:text-[#D4AF37] transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] text-white text-[9px] font-medium rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-[#1A1A1A] ml-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-8 md:px-16 pt-24">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            
            {/* Left Column - Text Content */}
            <div ref={contentRef} className="order-2 md:order-1 text-center md:text-left">
              {/* Brand */}
              <p className="text-[10px] font-sans font-medium tracking-[4px] uppercase text-[#D4AF37] mb-6">
                J. FERRÉ
              </p>

              {/* Main Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-[#1A1A1A] leading-[1.1] mb-6">
                Elegancia en<br />cada detalle
              </h1>

              {/* Subtitle */}
              <p className="text-[15px] md:text-base font-sans font-light text-[#6B6B6B] leading-relaxed max-w-md mx-auto md:mx-0 mb-10">
                Joyas contemporáneas diseñadas para acompañar cada momento especial.
              </p>

              {/* CTA Button */}
              <a 
                href="#productos"
                className="inline-block btn-primary"
              >
                Ver Colección
              </a>
            </div>

            {/* Right Column - Image */}
            <div ref={imageRef} className="order-1 md:order-2 flex justify-center md:justify-end">
              <div className="relative w-full max-w-md">
                <img
                  src="/images/hero-model-new-1280w.webp"
                  srcSet="/images/hero-model-new-480w.webp 480w,
                          /images/hero-model-new-768w.webp 768w,
                          /images/hero-model-new-1280w.webp 1280w,
                          /images/hero-model-new-1920w.webp 1920w"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  alt="Modelo luciendo joyas J. Ferré"
                  className="w-full h-auto object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
                {/* Subtle gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F7F3EF] to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[9px] font-sans tracking-[3px] uppercase text-[#6B6B6B]">Scroll</span>
          <div className="w-px h-8 bg-[#D4AF37] animate-pulse" />
        </div>
      </div>
    </section>
  );
}
