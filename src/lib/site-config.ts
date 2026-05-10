export interface SiteConfig {
  // Brand
  name: string;
  tagline: string;
  description: string;
  domain: string;

  // Industry
  industry:
    | "ristorazione"
    | "beauty"
    | "tech"
    | "servizi"
    | "ecommerce"
    | "turismo"
    | "salute"
    | "educazione"
    | "altro";
  subCategory?: string;

  // Localization
  language: string;

  // Contact
  address: {
    street: string;
    city: string;
    postalCode?: string;
    country: string;
  };
  phone?: string;
  email: string;
  whatsapp?: string;

  // Social (all optional)
  social?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
  };

  // Visual style
  design: {
    style: "editorial" | "modern" | "elegant" | "bold";
    palette: {
      primary: string;
      accent: string;
      background: string;
    };
    fontPairing: {
      display: string;
      body: string;
    };
    darkMode: "auto" | "always" | "never";
  };

  // Brand voice
  voice: {
    tone: 1 | 2 | 3 | 4 | 5;
    traits: string[];
    avoidWords?: string[];
    brandKeywords?: string[];
  };

  // Pages enabled
  pages: {
    home: boolean;
    chiSiamo: boolean;
    serviziMenu?: { enabled: boolean; label: string };
    galleria: boolean;
    eventi: boolean;
    blog: boolean;
    faq: boolean;
    contatti: boolean;
  };

  // Lead capture
  leadCapture: {
    form: boolean;
    phone: boolean;
    whatsappButton: boolean;
  };

  // Compliance
  gdpr: {
    cookieBanner: boolean;
  };

  // SEO
  seo: {
    defaultOgImage?: string;
  };

  // Layout — homepage hero variant + composable sections + category-page layout
  layout?: {
    hero: HeroVariant;
    sections: SectionId[];
    categoryLayout: CategoryLayout;
    heroAssets?: {
      image?: string;
      mosaic?: string[];
      carousel?: string[];
      video?: string;
    };
  };
}

export type HeroVariant =
  | "hero-fullbleed"
  | "hero-split"
  | "hero-carousel"
  | "hero-mosaic"
  | "hero-video"
  | "hero-form";

export type SectionId =
  | "section-featured-dishes"
  | "section-photo-mosaic"
  | "section-story"
  | "section-stats"
  | "section-press"
  | "section-testimonials"
  | "section-map-hours"
  | "section-blog-feed"
  | "section-cta-banner"
  | "section-newsletter"
  | "section-awards"
  | "section-events-strip";

export type CategoryLayout =
  | "cat-grid-cards"
  | "cat-list-thumb"
  | "cat-magazine"
  | "cat-filtered"
  | "cat-map"
  | "cat-pinterest";

export const DEFAULT_LAYOUT = {
  hero: "hero-fullbleed" as HeroVariant,
  sections: [
    "section-featured-dishes",
    "section-story",
    "section-photo-mosaic",
    "section-blog-feed",
    "section-cta-banner",
  ] as SectionId[],
  categoryLayout: "cat-grid-cards" as CategoryLayout,
};

export function defineSiteConfig(config: SiteConfig): SiteConfig {
  return {
    ...config,
    layout: config.layout ?? { ...DEFAULT_LAYOUT, heroAssets: {} },
  };
}
