import { Globe, Wrench } from "lucide-react";
import { cvContent } from "@/lib/cv-content";

export function SkillsSection() {
  return (
    <section
      className="relative z-10 border-t border-zinc-800 bg-zinc-950 px-6 py-24 md:px-20"
      aria-labelledby="skills-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 font-mono text-xs tracking-[0.4em] text-red-600 uppercase">
              Stack
            </p>
            <h2
              id="skills-heading"
              className="text-4xl font-black tracking-tighter text-white md:text-6xl"
            >
              Tecnologias & Habilidades
            </h2>
            <p className="mt-4 max-w-xl text-lg text-zinc-400">
              Ferramentas que uso no dia a dia — da edição tradicional à produção
              assistida por inteligência artificial.
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {cvContent.skillCategories.map((category) => (
            <article
              key={category.title}
              className="interactive border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur-md transition-colors hover:border-red-500/40"
            >
              <Wrench
                className="mb-4 text-red-500"
                size={24}
                aria-hidden="true"
              />
              <h3 className="mb-6 text-lg font-bold tracking-wide text-white uppercase">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-black px-4 py-2 text-[10px] font-bold tracking-widest text-zinc-300 uppercase"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 border border-zinc-800 bg-black/40 p-8">
          <div className="mb-6 flex items-center gap-3">
            <Globe className="text-red-500" size={24} aria-hidden="true" />
            <h3 className="text-lg font-bold tracking-wide text-white uppercase">
              Idiomas
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {cvContent.languages.map((lang) => (
              <div
                key={lang.name}
                className="flex items-center justify-between border border-zinc-800 px-6 py-4"
              >
                <span className="font-semibold text-white">{lang.name}</span>
                <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
                  {lang.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
