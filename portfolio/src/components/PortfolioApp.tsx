import { AboutSection } from "@/components/portfolio/AboutSection";
import { ScrollProvider } from "@/components/ScrollProvider";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { CurrentProjects } from "@/components/portfolio/CurrentProjects";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { HorizontalGallery } from "@/components/portfolio/HorizontalGallery";
import { SkillsSection } from "@/components/portfolio/SkillsSection";

export function PortfolioApp() {
  return (
    <ScrollProvider>
      <div className="min-h-screen overflow-x-clip bg-[#050505] font-sans text-white selection:bg-red-500 selection:text-white">
        <main>
          <HeroSection />
          <AboutSection />
          <HorizontalGallery />
          <ExperienceSection />
          <SkillsSection />
          <CurrentProjects />
          <ContactSection />
        </main>
      </div>
    </ScrollProvider>
  );
}
