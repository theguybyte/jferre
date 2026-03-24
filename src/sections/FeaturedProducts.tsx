import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingBag, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: number;
  name: string;
  material: string;
  price: number;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Collar Aura',
    material: 'Plata 925',
    price: 45000,
    image: '/images/product-collar-aura.jpg',
  },
  {
    id: 2,
    name: 'Anillo Lumière',
    material: 'Plata 925',
    price: 32000,
    image: '/images/product-anillo-lumiere.jpg',
  },
  {
    id: 3,
    name: 'Pulsera Nova',
    material: 'Acero',
    price: 28000,
    image: '/images/product-pulsera-nova.jpg',
  },
  {
    id: 4,
    name: 'Collar Celeste',
    material: 'Oro',
    price: 125000,
    image: '/images/product-collar-celeste.jpg',
  },
];

interface FeaturedProductsProps {
  onAddToCart: (product: Product) => void;
}

export function FeaturedProducts({ onAddToCart }: FeaturedProductsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set());

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      ScrollTrigger.create({
        trigger: headerRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(
            headerRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
          );
        },
        once: true,
      });

      // Products grid animation
      const cards = gridRef.current?.querySelectorAll('.product-card');
      if (cards) {
        ScrollTrigger.create({
          trigger: gridRef.current,
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo(
              cards,
              { y: 60, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.12,
              }
            );
          },
          once: true,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    setAddedProducts((prev) => new Set(prev).add(product.id));
    
    // Reset the added state after 2 seconds
    setTimeout(() => {
      setAddedProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section
      ref={sectionRef}
      id="productos"
      className="relative w-full py-24 md:py-32 bg-white"
    >
      <div className="max-w-6xl mx-auto px-8 md:px-16">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16 opacity-0">
          <p className="text-[10px] font-sans font-medium tracking-[4px] uppercase text-[#D4AF37] mb-4">
            Colección
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-[#1A1A1A] mb-4">
            Joyas Destacadas
          </h2>
          <p className="text-sm font-sans font-light text-[#6B6B6B] max-w-md mx-auto">
            Piezas exclusivas seleccionadas para ti
          </p>
        </div>

        {/* Products Grid */}
        <div 
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {products.map((product) => (
            <div 
              key={product.id}
              className="product-card group opacity-0"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-[#F7F3EF] mb-4">
                <img
                  src={product.image.replace('.jpg', '-400w.webp')}
                  srcSet={`${product.image.replace('.jpg', '-200w.webp')} 200w, ${product.image.replace('.jpg', '-400w.webp')} 400w, ${product.image.replace('.jpg', '-600w.webp')} 600w`}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Quick Add Button - appears on hover */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="absolute bottom-4 left-4 right-4 py-3 bg-white/95 backdrop-blur-sm text-[#1A1A1A] text-[10px] font-sans font-medium tracking-[2px] uppercase flex items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#1A1A1A] hover:text-white"
                >
                  {addedProducts.has(product.id) ? (
                    <>
                      <Check className="w-4 h-4" strokeWidth={2} />
                      Agregado
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" strokeWidth={2} />
                      Agregar
                    </>
                  )}
                </button>
              </div>

              {/* Product Info */}
              <div className="text-center">
                <h3 className="text-sm font-display text-[#1A1A1A] mb-1">
                  {product.name}
                </h3>
                <p className="text-[10px] font-sans text-[#6B6B6B] tracking-wide uppercase mb-2">
                  {product.material}
                </p>
                <p className="text-sm font-sans font-medium text-[#1A1A1A]">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-14">
          <a 
            href="#colecciones"
            className="inline-flex items-center gap-2 text-[11px] font-sans font-medium tracking-[2px] uppercase text-[#1A1A1A] border-b border-[#1A1A1A] pb-1 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors duration-300"
          >
            Ver toda la colección
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
