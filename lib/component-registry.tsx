import React from 'react';

// HLAVIČKY
import NavbarNeon from "@/app/components/themes/header/NavbarNeon";
import NavbarCinematic from "@/app/components/themes/header/NavbarCinematic";
import NavbarElegant from "@/app/components/themes/header/NavbarElegant";
import HeaderIndustrial from "@/app/components/themes/header/HeaderIndustrial";
import HeaderStandard from "@/app/components/blocks/header/HeaderStandard";
import NavbarUtilitarian from "@/app/components/themes/header/NavbarUtilitarian";
import HeaderLuxury from "@/app/components/themes/header/HeaderLuxury";

// HERO SEKCE
import HeroCinematic from "@/app/components/themes/hero/HeroCinematic";
import HeroNeon from "@/app/components/themes/hero/HeroNeon";
import HeroInteractive from "@/app/components/themes/hero/HeroInteractive";
import HeroCircle from "@/app/components/themes/hero/HeroCircle";
import HeroIndustrial from "@/app/components/themes/hero/HeroIndustrial";
import HeroUtilitarian from "@/app/components/themes/hero/HeroUtilitarian";
import HeroSplit from "@/app/components/blocks/hero/HeroSplit";
import HeroSubpage from "@/app/components/themes/hero/HeroSubpage";
import HeroLuxury from "@/app/components/themes/hero/HeroLuxury";

// SLUŽBY & OBSAH
import ServicesBentoGrid from "@/app/components/themes/services/ServicesBentoGrid";
import ServicesUtilitarian from "@/app/components/themes/services/ServicesUtilitarian";
import ServicesGrid from '@/app/components/themes/services/ServicesGrid';
import ServicesInteractive from "@/app/components/themes/services/ServicesInteractive";
import TextMediaStandard from "@/app/components/blocks/content/TextMediaStandard";
import ServicesStandard from "@/app/components/blocks/services/ServicesStandard";

// REFERENCE & OSTATNÍ
import VideoGrid from "@/app/components/themes/other/VideoGrid";
import TestimonialsPremium from "@/app/components/themes/other/TestimonialsPremium";
import TestimonialsStandard from "@/app/components/blocks/testimonials/TestimonialsStandard";

// PATIČKY
import FooterIndustrial from "@/app/components/themes/footer/FooterIndustrial";
import FooterUtilitarian from "@/app/components/themes/footer/FooterUtilitarian";
import FooterNeon from "@/app/components/themes/footer/FooterNeon";
import FooterCinematic from "@/app/components/themes/footer/FooterCinematic";
import FooterElegant from "@/app/components/themes/footer/FooterElegant";
import FooterLuxury from "@/app/components/themes/footer/FooterLuxury";
import FooterStandard from "@/app/components/blocks/footer/FooterStandard";

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