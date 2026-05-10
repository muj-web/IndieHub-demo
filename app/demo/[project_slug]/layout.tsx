import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ project_slug: string }>;
}) {
  const resolvedParams = await params;
  const projectSlug = resolvedParams.project_slug;

  // Hledáme projekt v naší nové tabulce 'projects'
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', projectSlug)
    .single();

  if (!project) notFound();

  const isWireframe = project.is_wireframe;
  
  // Zachováme barvy z databáze nebo přepneme na wireframe mód
  const activeColorPalette = isWireframe ? { bg: '#ffffff', text: '#000000', accent: '#000000', surface: '#f4f4f5' } : project.color_palette;
  const activeDesignConfig = isWireframe ? { ...project.design_config, radius: '0px', font_heading: 'Inter' } : project.design_config;

  const dynamicStyles = {
    '--color-dt-bg': activeColorPalette?.bg || '#ffffff',
    '--color-dt-text': activeColorPalette?.text || '#000000',
    '--color-dt-accent': activeColorPalette?.accent || '#8E44ED',
    '--color-dt-surface': activeColorPalette?.surface || '#f4f4f5',
    '--dt-radius': activeDesignConfig?.radius || '0.75rem',
    '--dt-font-heading': activeDesignConfig?.font_heading || 'Inter',
    backgroundColor: 'var(--color-dt-bg)',
    color: 'var(--color-dt-text)'
  } as React.CSSProperties;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isWireframe ? 'wireframe-mode' : ''}`} style={dynamicStyles}>
      {children}
    </div>
  );
}