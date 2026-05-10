export const THEME_PRESETS: Record<string, any> = {
  minimal: {
    name: "Minimal (Výchozí)",
    color_palette: { bg: "#ffffff", text: "#18181B", accent: "#8E44ED", surface: "#f4f4f5" },
    design_config: { font_heading: "Inter", radius: "0.75rem", content_width: "60", align: "center" }
  },
  luxury: {
    name: "Luxury / Premium",
    color_palette: { bg: "#ffffff", text: "#224c45", accent: "#ae9760", surface: "#fcfaf5" }, // Hair Play barvy!
    design_config: { font_heading: "Playfair Display", radius: "0px", content_width: "60", align: "center" }
  },
  industrial: {
    name: "Industrial / Heavy",
    color_palette: { bg: "#09090B", text: "#FAFAFA", accent: "#E11D48", surface: "#18181B" },
    design_config: { font_heading: "Inter", radius: "0px", content_width: "80", align: "left" }
  },
  neon: {
    name: "Neon / Tech",
    color_palette: { bg: "#050507", text: "#F1F2F2", accent: "#ccff00", surface: "#14141A" },
    design_config: { font_heading: "Lexend", radius: "1.5rem", content_width: "60", align: "center" }
  },
  wedding: {
    name: "Wedding / Romantic",
    color_palette: { bg: "#FDFBF7", text: "#4A4036", accent: "#D4A373", surface: "#FFFFFF" },
    design_config: { font_heading: "Playfair Display", radius: "9999px", content_width: "50", align: "center" }
  }
};