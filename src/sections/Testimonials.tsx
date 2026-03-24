import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Quote } from 'lucide-react';
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/free-mode';
import { testimonialsConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  if (!testimonialsConfig.titleRegular && testimonialsConfig.testimonials.length === 0) return null;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header — slide up
      ScrollTrigger.create({
        trigger: headerRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(
            headerRef.current,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
          );
        },
        once: true,
      });

      // Carousel — fade up
      ScrollTrigger.create({
        trigger: carouselRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(
            carouselRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
          );
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonios"
      className="relative w-full py-24 md:py-32 bg-white overflow-hidden"
    >
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-20">
        <div ref={headerRef} className="text-center opacity-0">
          {testimonialsConfig.subtitle && (
            <p className="text-[#c9a86c] text-xs font-sans uppercase tracking-[3px] mb-4">
              {testimonialsConfig.subtitle}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-[#1a1a1a] tracking-tight">
            {testimonialsConfig.titleRegular} <span className="font-serif italic font-normal text-[#c9a86c]">{testimonialsConfig.titleItalic}</span>
          </h2>
        </div>
      </div>

      {/* Testimonials Carousel */}
      <div ref={carouselRef} className="relative opacity-0 max-w-6xl mx-auto px-6 md:px-12">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={32}
          slidesPerView={1}
          loop={true}
          speed={600}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            768: {
              slidesPerView: 2,
              spaceBetween: 32,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 32,
            },
          }}
        >
          {testimonialsConfig.testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id} className="h-auto">
              <div className="group bg-[#f5f0e8] rounded-lg p-8 h-full flex flex-col transition-all duration-500 hover:shadow-xl">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-[#c9a86c]/40 mb-4 flex-shrink-0" strokeWidth={1.5} />

                {/* Quote text */}
                <p className="text-[#4a4a4a] font-sans text-base leading-relaxed mb-6 flex-grow">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-[#e8e0d5]">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={testimonial.image.replace('.jpg', '-128w.webp')}
                      srcSet={`${testimonial.image.replace('.jpg', '-64w.webp')} 64w, ${testimonial.image.replace('.jpg', '-128w.webp')} 128w`}
                      sizes="64px"
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-[#1a1a1a] text-sm truncate">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-[#4a4a4a] font-sans">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Decorative element */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16">
        <div className="h-px bg-gradient-to-r from-transparent via-[#c9a86c]/20 to-transparent" />
      </div>
    </section>
  );
}
