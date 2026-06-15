"use client";

import { useCallback, useState } from "react";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { CurrentProjects } from "@/components/portfolio/CurrentProjects";
import { CustomCursor } from "@/components/portfolio/CustomCursor";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { HorizontalGallery } from "@/components/portfolio/HorizontalGallery";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import { TerminalLoader } from "@/components/portfolio/TerminalLoader";

export function PortfolioApp() {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleLoadComplete = useCallback(() => setIsLoaded(true), []);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#050505] font-sans text-white selection:bg-red-500 selection:text-white">
      <CustomCursor />

      {!isLoaded ? (
        <TerminalLoader onComplete={handleLoadComplete} />
      ) : (
        <main className="animate-fade-in">
          <HeroSection />
          <AboutSection />
          <HorizontalGallery />
          <ExperienceSection />
          <SkillsSection />
          <CurrentProjects />
          <ContactSection />
        </main>
      )}
    </div>
  );
}
