import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { ComponentRegistry } from "@/lib/component-registry";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DynamicProjectPage({ params }: { params: Promise<{ project_slug: string, page_slug?: string[] }> }) {
  const resolvedParams = await params;
  const projectSlug = resolvedParams.project_slug;
  const pageSlug = resolvedParams.page_slug ? resolvedParams.page_slug[0] : null;

  // OPRAVA: Ptáme se správné tabulky 'projects'
  const { data: project } = await supabase
    .from('projects')
    .select('id, client_name, color_palette, design_config, is_wireframe')
    .eq('slug', projectSlug)
    .single();
    
  if (!project) notFound();

  const isWireframe = project.is_wireframe;
  const activeColorPalette = isWireframe ? { bg: '#ffffff', text: '#000000', accent: '#000000', surface: '#f4f4f5' } : project.color_palette;
  
  // Bezpečný merge design konfigurace
  const activeDesignConfig = isWireframe 
    ? { ...(project.design_config || {}), radius: '0px', font_heading: 'Inter' } 
    : (project.design_config || {});

  const { data: allPages } = await supabase.from('project_pages').select('*').eq('project_id', project.id).order('order_index');
  
  const homePage = allPages?.find(p => p.is_homepage);
  const currentPage = pageSlug ? allPages?.find(p => p.slug === pageSlug) : homePage;
  
  if (!currentPage) notFound();

  const { data: currentSections } = await supabase.from('project_sections').select('*').eq('page_id', currentPage.id).order('order_index');
  let finalSections = currentSections || [];

  if (!currentPage.is_homepage && homePage) {
    const { data: homeSections } = await supabase.from('project_sections').select('*').eq('page_id', homePage.id).order('order_index');
    if (homeSections) {
      const headers = homeSections.filter(s => s.component_type.startsWith('header-'));
      const footers = homeSections.filter(s => s.component_type.startsWith('footer-'));
      finalSections = [...headers, ...finalSections, ...footers];
    }
  }

  return (
    <main className="flex-grow flex flex-col relative">
      {(!finalSections || finalSections.length === 0) && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-zinc-400 font-medium uppercase tracking-widest text-xs">Prázdná stránka</p>
        </div>
      )}

      {finalSections?.map((section) => {
        const Component = ComponentRegistry[section.component_type];
        if (!Component) return null;

        return (
          <Component 
            key={section.id} 
            data={section.content_data} 
            projectName={project.client_name}
            allPages={allPages || []}
            projectSlug={projectSlug}
            colorPalette={activeColorPalette}
            designConfig={activeDesignConfig}
          />
        );
      })}
    </main>
  );
}