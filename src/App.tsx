import { lazy, Suspense, useEffect, useState } from 'react';
import { useLenis } from './hooks/useLenis';
import { Hero } from './sections/Hero';
import { siteConfig } from './config';
import './App.css';

const FeaturedProducts = lazy(() => import('./sections/FeaturedProducts').then(m => ({ default: m.FeaturedProducts })));
const TrustBadges      = lazy(() => import('./sections/TrustBadges').then(m => ({ default: m.TrustBadges })));
const IntroGrid        = lazy(() => import('./sections/IntroGrid').then(m => ({ default: m.IntroGrid })));
const Services         = lazy(() => import('./sections/Services').then(m => ({ default: m.Services })));
const WhyChooseMe      = lazy(() => import('./sections/WhyChooseMe').then(m => ({ default: m.WhyChooseMe })));
const FeaturedProjects = lazy(() => import('./sections/FeaturedProjects').then(m => ({ default: m.FeaturedProjects })));
const Testimonials     = lazy(() => import('./sections/Testimonials').then(m => ({ default: m.Testimonials })));
const FAQ              = lazy(() => import('./sections/FAQ').then(m => ({ default: m.FAQ })));
const Footer           = lazy(() => import('./sections/Footer').then(m => ({ default: m.Footer })));
const CartDrawer       = lazy(() => import('./components/CartDrawer').then(m => ({ default: m.CartDrawer })));

interface CartItem {
  id: number;
  name: string;
  material: string;
  price: number;
  image: string;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  material: string;
  price: number;
  image: string;
}

function App() {
  // Initialize Lenis smooth scroll
  useLenis();

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (siteConfig.siteTitle) {
      document.title = siteConfig.siteTitle;
    }
    if (siteConfig.siteDescription) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', siteConfig.siteDescription);
    }
    if (siteConfig.language) {
      document.documentElement.lang = siteConfig.language;
    }
  }, []);

  // Cart Functions
  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="relative w-full overflow-x-hidden bg-[#F7F3EF]">
      <Hero cartItemCount={cartItemCount} onCartClick={() => setIsCartOpen(true)} />

      <Suspense fallback={null}>
        <FeaturedProducts onAddToCart={addToCart} />
        <TrustBadges />
        <IntroGrid />
        <Services />
        <WhyChooseMe />
        <FeaturedProjects />
        <Testimonials />
        <FAQ />
        <Footer />
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
        />
        {cartItemCount > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-[#1A1A1A] text-white rounded-full shadow-lg flex items-center justify-center z-40 md:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] text-white text-[9px] font-medium rounded-full flex items-center justify-center">
              {cartItemCount}
            </span>
          </button>
        )}
      </Suspense>
    </main>
  );
}

export default App;
