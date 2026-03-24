// Site Configuration
// J. Ferré Joyería - Configuración del sitio

export interface SiteConfig {
  language: string;
  siteTitle: string;
  siteDescription: string;
}

export const siteConfig: SiteConfig = {
  language: "es",
  siteTitle: "J. Ferré Joyería | Elegancia en cada detalle",
  siteDescription: "Descubre la colección exclusiva de J. Ferré Joyería. Plata 925, oro 18k y acero inoxidable de la más alta calidad. Piezas únicas diseñadas para iluminar tus momentos especiales.",
};

// Hero Section
export interface HeroConfig {
  backgroundText: string;
  heroImage: string;
  heroImageAlt: string;
  overlayText: string;
  brandName: string;
  navLinks: { label: string; href: string }[];
}

export const heroConfig: HeroConfig = {
  backgroundText: "J. FERRÉ",
  heroImage: "/images/hero-model-new-1280w.webp",
  heroImageAlt: "Mujer elegante luciendo joyas J. Ferré",
  overlayText: "Elegancia en cada detalle",
  brandName: "J. FERRÉ",
  navLinks: [
    { label: "INICIO", href: "#inicio" },
    { label: "COLECCIONES", href: "#colecciones" },
    { label: "PLATA 925", href: "#plata" },
    { label: "ORO", href: "#oro" },
    { label: "ACERO", href: "#acero" },
    { label: "CONTACTO", href: "#contacto" },
  ],
};

// Intro Grid Section
export interface PortfolioImage {
  src: string;
  alt: string;
}

export interface IntroGridConfig {
  titleLine1: string;
  titleLine2: string;
  description: string;
  portfolioImages: PortfolioImage[];
  accentText: string;
}

export const introGridConfig: IntroGridConfig = {
  titleLine1: "PIEZAS",
  titleLine2: "únicas",
  description: "Cada pieza de J. Ferré cuenta una historia. Desde la plata 925 hasta el oro más puro, nuestras joyas están diseñadas para iluminar tus momentos más especiales.",
  portfolioImages: [
    { src: "/images/portfolio-1.jpg", alt: "Manos con anillos de oro y piedras oscuras" },
    { src: "/images/portfolio-2.jpg", alt: "Pulsera de cadena dorada en muñeca" },
    { src: "/images/portfolio-3.jpg", alt: "Aros de aro dorados sobre tela crema" },
    { src: "/images/portfolio-4.jpg", alt: "Múltiples pulseras doradas apiladas" },
    { src: "/images/portfolio-5.jpg", alt: "Anillo de oro con gema roja" },
  ],
  accentText: "Colección 2024 - 2025",
};

// Featured Projects Section
export interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  image: string;
  description: string;
}

export interface FeaturedProjectsConfig {
  subtitle: string;
  titleRegular: string;
  titleItalic: string;
  viewAllText: string;
  viewAllHref: string;
  viewProjectText: string;
  projects: Project[];
}

export const featuredProjectsConfig: FeaturedProjectsConfig = {
  subtitle: "COLECCIONES DESTACADAS",
  titleRegular: "Nuestras",
  titleItalic: "favoritas",
  viewAllText: "Ver todas las colecciones",
  viewAllHref: "#colecciones",
  viewProjectText: "Explorar colección",
  projects: [
    {
      id: 1,
      title: "Colección Plata 925",
      category: "Plata",
      year: "2024",
      image: "/images/collection-plata.jpg",
      description: "Elegancia atemporal en plata esterlina de la más alta calidad",
    },
    {
      id: 2,
      title: "Colección Oro",
      category: "Oro",
      year: "2024",
      image: "/images/collection-oro.jpg",
      description: "Piezas exclusivas en oro 18k para momentos inolvidables",
    },
    {
      id: 3,
      title: "Colección Acero",
      category: "Acero",
      year: "2024",
      image: "/images/collection-acero.jpg",
      description: "Estilo moderno y duradero para el día a día",
    },
    {
      id: 4,
      title: "Colección Anillos",
      category: "Anillos",
      year: "2024",
      image: "/images/collection-anillos.jpg",
      description: "Desde delicados solitarios hasta llamativos diseños de statement",
    },
  ],
};

// Services Section
export interface ServiceItem {
  iconName: string;
  title: string;
  description: string;
}

export interface ServicesConfig {
  subtitle: string;
  titleLine1: string;
  titleLine2Italic: string;
  description: string;
  services: ServiceItem[];
}

export const servicesConfig: ServicesConfig = {
  subtitle: "NUESTROS SERVICIOS",
  titleLine1: "Experiencia",
  titleLine2Italic: "J. Ferré",
  description: "Más que joyas, ofrecemos una experiencia de lujo personalizada para cada cliente",
  services: [
    {
      iconName: "Diamond",
      title: "Diseño Personalizado",
      description: "Creamos piezas únicas diseñadas especialmente para ti, desde el boceto hasta la joya final",
    },
    {
      iconName: "Sparkles",
      title: "Grabado Especial",
      description: "Personaliza tus piezas con grabados que captured tus momentos más especiales",
    },
    {
      iconName: "Users",
      title: "Asesoría de Estilo",
      description: "Nuestros expertos te guían para encontrar las piezas perfectas para cada ocasión",
    },
    {
      iconName: "Truck",
      title: "Envío Express",
      description: "Entrega rápida y segura para que disfrutes tus joyas cuanto antes",
    },
  ],
};

// Why Choose Me Section
export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface FeatureCard {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
}

export interface WhyChooseMeConfig {
  subtitle: string;
  titleRegular: string;
  titleItalic: string;
  statsLabel: string;
  stats: StatItem[];
  featureCards: FeatureCard[];
  wideImage: string;
  wideImageAlt: string;
  wideTitle: string;
  wideDescription: string;
}

export const whyChooseMeConfig: WhyChooseMeConfig = {
  subtitle: "POR QUÉ ELEGIRNOS",
  titleRegular: "La diferencia",
  titleItalic: "J. Ferré",
  statsLabel: "NUESTROS NÚMEROS",
  stats: [
    { value: 15, suffix: "+", label: "Años de experiencia" },
    { value: 50, suffix: "k+", label: "Clientes satisfechos" },
    { value: 100, suffix: "%", label: "Materiales certificados" },
  ],
  featureCards: [
    {
      image: "/images/feature-craftsmanship.jpg",
      imageAlt: "Artesano creando joyas",
      title: "Calidad Garantizada",
      description: "Todos nuestros materiales son certificados y cumplen con los más altos estándares de calidad internacional",
    },
    {
      image: "/images/feature-design.jpg",
      imageAlt: "Diseñadora trabajando",
      title: "Diseño Exclusivo",
      description: "Cada colección es diseñada por nuestros artesanos para ofrecerte piezas únicas y exclusivas",
    },
  ],
  wideImage: "/images/wide-display.jpg",
  wideImageAlt: "Vitrina de joyas J. Ferré",
  wideTitle: "Crea tu historia",
  wideDescription: "Cada joya J. Ferré es el comienzo de una nueva historia. ¿Cuál será la tuya?",
};

// Testimonials Section
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  quote: string;
}

export interface TestimonialsConfig {
  subtitle: string;
  titleRegular: string;
  titleItalic: string;
  testimonials: Testimonial[];
}

export const testimonialsConfig: TestimonialsConfig = {
  subtitle: "TESTIMONIOS",
  titleRegular: "Lo que dicen",
  titleItalic: "nuestros clientes",
  testimonials: [
    {
      id: 1,
      name: "María González",
      role: "Cliente fiel",
      image: "/images/testimonial-1.jpg",
      quote: "Cada pieza que he comprado en J. Ferré ha superado mis expectativas. La calidad es excepcional y el servicio, inmejorable.",
    },
    {
      id: 2,
      name: "Carolina Martínez",
      role: "Nueva cliente",
      image: "/images/testimonial-2.jpg",
      quote: "Descubrí J. Ferré hace un mes y ya soy fan. Mis anillos de plata son hermosos y recibo cumplidos todos los días.",
    },
    {
      id: 3,
      name: "Laura Benítez",
      role: "Coleccionista",
      image: "/images/testimonial-3.jpg",
      quote: "La atención personalizada y el diseño exclusivo hacen de J. Ferré mi joyería de confianza. Altamente recomendado.",
    },
    {
      id: 4,
      name: "Ana Lucero",
      role: "Cliente VIP",
      image: "/images/testimonial-4.jpg",
      quote: "El anillo de compromiso que diseñaron para mí es único. Capturaron exactamente lo que soñaba.",
    },
  ],
};

// FAQ Section
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQConfig {
  subtitle: string;
  titleRegular: string;
  titleItalic: string;
  ctaText: string;
  ctaButtonText: string;
  ctaHref: string;
  faqs: FAQItem[];
}

export const faqConfig: FAQConfig = {
  subtitle: "PREGUNTAS FRECUENTES",
  titleRegular: "Todo lo que",
  titleItalic: "necesitas saber",
  ctaText: "¿Tienes otras preguntas?",
  ctaButtonText: "Contáctanos",
  ctaHref: "#contacto",
  faqs: [
    {
      id: "faq-1",
      question: "¿Cuáles son los materiales que utilizan?",
      answer: "Trabajamos con plata 925, oro 18k y acero inoxidable de alta calidad. Todos nuestros materiales son certificados y hipoalergénicos.",
    },
    {
      id: "faq-2",
      question: "¿Ofrecen garantía en sus productos?",
      answer: "Sí, todos nuestros productos incluyen garantía de 1 año contra defectos de fabricación. La plata 925 y el oro tienen garantía de por vida en su autenticidad.",
    },
    {
      id: "faq-3",
      question: "¿Puedo personalizar una joya?",
      answer: "¡Por supuesto! Ofrecemos servicio de diseño personalizado. Contáctanos y nuestros diseñadores crearán la pieza de tus sueños.",
    },
    {
      id: "faq-4",
      question: "¿Cuánto tarda el envío?",
      answer: "Los envíos estándar tardan 3-5 días hábiles. También ofrecemos envío express de 24-48 horas en zonas seleccionadas.",
    },
    {
      id: "faq-5",
      question: "¿Cómo cuido mis joyas?",
      answer: "Te recomendamos limpiar tus joyas con un paño suave, evitar el contacto con productos químicos y guardarlas en su estuche cuando no las uses.",
    },
  ],
};

// Footer Section
export interface SocialLink {
  iconName: string;
  href: string;
  label: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterConfig {
  logoText: string;
  contactLabel: string;
  email: string;
  locationText: string;
  navigationLabel: string;
  navLinks: FooterLink[];
  socialLabel: string;
  socialLinks: SocialLink[];
  tagline: string;
  copyright: string;
  bottomLinks: FooterLink[];
}

export const footerConfig: FooterConfig = {
  logoText: "J. FERRÉ",
  contactLabel: "Contacto",
  email: "www.jferre.com.ar",
  locationText: "Ituzaingo 270\nCiudad de Córdoba, Argentina",
  navigationLabel: "Navegación",
  navLinks: [
    { label: "Inicio", href: "#inicio" },
    { label: "Colecciones", href: "#colecciones" },
    { label: "Plata 925", href: "#plata" },
    { label: "Oro", href: "#oro" },
    { label: "Acero", href: "#acero" },
    { label: "Contacto", href: "#contacto" },
  ],
  socialLabel: "Síguenos",
  socialLinks: [
    { iconName: "Instagram", href: "https://instagram.com", label: "Instagram" },
    { iconName: "Facebook", href: "https://facebook.com", label: "Facebook" },
    { iconName: "Twitter", href: "https://twitter.com", label: "Twitter" },
    { iconName: "Mail", href: "mailto:info@jferre.com.ar", label: "Email" },
  ],
  tagline: "J. Ferré es la excelencia en la atención,\nla dedicación por los detalles.",
  copyright: "© 2024 J. Ferré Joyería. Todos los derechos reservados.",
  bottomLinks: [
    { label: "Términos y condiciones", href: "#terminos" },
    { label: "Política de privacidad", href: "#privacidad" },
  ],
};
