import React from 'react';

// HLAVIČKY
import NavbarNeon from "@/app/components/engine/themes/header/NavbarNeon";
import NavbarCinematic from "@/app/components/engine/themes/header/NavbarCinematic";
import NavbarElegant from "@/app/components/engine/themes/header/NavbarElegant";
import HeaderIndustrial from "@/app/components/engine/themes/header/HeaderIndustrial";
import HeaderStandard from "@/app/components/engine/blocks/header/HeaderStandard";
import NavbarUtilitarian from "@/app/components/engine/themes/header/NavbarUtilitarian";
import HeaderLuxury from "@/app/components/engine/themes/header/HeaderLuxury";

// HERO SEKCE
import HeroCinematic from "@/app/components/engine/themes/hero/HeroCinematic";
import HeroNeon from "@/app/components/engine/themes/hero/HeroNeon";
import HeroInteractive from "@/app/components/engine/themes/hero/HeroInteractive";
import HeroCircle from "@/app/components/engine/themes/hero/HeroCircle";
import HeroIndustrial from "@/app/components/engine/themes/hero/HeroIndustrial";
import HeroUtilitarian from "@/app/components/engine/themes/hero/HeroUtilitarian";
import HeroSplit from "@/app/components/engine/blocks/hero/HeroSplit";
import HeroSubpage from "@/app/components/engine/themes/hero/HeroSubpage";
import HeroLuxury from "@/app/components/engine/themes/hero/HeroLuxury";

// SLUŽBY & OBSAH
import ServicesBentoGrid from "@/app/components/engine/themes/services/ServicesBentoGrid";
import ServicesUtilitarian from "@/app/components/engine/themes/services/ServicesUtilitarian";
import ServicesGrid from '@/app/components/engine/themes/services/ServicesGrid';
import ServicesInteractive from "@/app/components/engine/themes/services/ServicesInteractive";
import TextMediaStandard from "@/app/components/engine/blocks/content/TextMediaStandard";
import ServicesStandard from "@/app/components/engine/blocks/services/ServicesStandard";

// REFERENCE & OSTATNÍ
import VideoGrid from "@/app/components/engine/themes/other/VideoGrid";
import TestimonialsPremium from "@/app/components/engine/themes/other/TestimonialsPremium";
import TestimonialsStandard from "@/app/components/engine/blocks/testimonials/TestimonialsStandard";

// PATIČKY
import FooterIndustrial from "@/app/components/engine/themes/footer/FooterIndustrial";
import FooterUtilitarian from "@/app/components/engine/themes/footer/FooterUtilitarian";
import FooterNeon from "@/app/components/engine/themes/footer/FooterNeon";
import FooterCinematic from "@/app/components/engine/themes/footer/FooterCinematic";
import FooterElegant from "@/app/components/engine/themes/footer/FooterElegant";
import FooterLuxury from "@/app/components/engine/themes/footer/FooterLuxury";
import FooterStandard from "@/app/components/engine/blocks/footer/FooterStandard";

export const ComponentRegistry: any = {
  // HLAVIČKY
  'header-industrial': HeaderIndustrial,
  'header-neon': NavbarNeon,
  'header-cinematic': NavbarCinematic,
  'header-elegant': NavbarElegant,
  'header-utilitarian': NavbarUtilitarian,
  'header-standard': HeaderStandard,
  'header-luxury': HeaderLuxury,

  // HERO SEKCE
  'hero-cinematic': HeroCinematic,
  'hero-neon': HeroNeon,
  'hero-interactive': HeroInteractive,
  'hero-circle': HeroCircle,
  'hero-industrial': HeroIndustrial,
  'hero-utilitarian': HeroUtilitarian,
  'hero-split': HeroSplit,
  'hero-subpage': HeroSubpage,
  'hero-luxury': HeroLuxury,

  // OBSAH A SLUŽBY
  'services-bento': ServicesBentoGrid,
  'services-utilitarian': ServicesUtilitarian,
  'services-grid': ServicesGrid,
  'services-interactive': ServicesInteractive,
  'content-standard': TextMediaStandard,
  'services-standard': ServicesStandard,

  // REFERENCE
  'testimonials-video': VideoGrid,
  'testimonials-premium': TestimonialsPremium,
  'testimonials-standard': TestimonialsStandard,

  // PATIČKY
  'footer-industrial': FooterIndustrial,
  'footer-neon': FooterNeon,
  'footer-cinematic': FooterCinematic,
  'footer-elegant': FooterElegant,
  'footer-utilitarian': FooterUtilitarian,
  'footer-luxury': FooterLuxury,
  'footer-standard': FooterStandard,
};