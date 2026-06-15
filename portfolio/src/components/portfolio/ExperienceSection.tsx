import { Briefcase } from "lucide-react";
import { cvContent } from "@/lib/cv-content";

export function ExperienceSection() {
  return (
    <section
      className="relative z-10 bg-[#050505] px-6 py-24 md:px-20"
      aria-labelledby="experience-heading"
    >
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 font-mono text-xs tracking-[0.4em] text-red-600 uppercase">
          Trajetória
        </p>
        <h2
          id="experience-heading"
          className="mb-16 text-4xl font-black tracking-tighter text-white md:text-6xl"
        >
          Experiência Profissional
        </h2>

        <div className="space-y-0">
          {cvContent.experience.map((job, index) => (
            <article
              key={job.company}
              className={`interactive group grid gap-6 border-t border-zinc-800 py-12 md:grid-cols-[280px_1fr] md:gap-12 ${index === 0 ? "border-t-0 pt-0" : ""}`}
            >
              <div>
                <div className="mb-3 flex items-center gap-2 text-red-500">
                  <Briefcase size={16} aria-hidden="true" />
                  <span className="font-mono text-xs tracking-widest uppercase">
                    {job.period}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{job.role}</h3>
                <p className="mt-1 text-sm font-semibold text-zinc-400">
                  {job.company}
                </p>
                <p className="mt-1 text-xs text-zinc-600">{job.location}</p>
              </div>

              <div>
                <p className="text-lg leading-relaxed text-zinc-400">
                  {job.description}
                </p>
                <ul className="mt-6 space-y-2">
                  {job.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-zinc-300"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  {job.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full bg-zinc-900 px-3 py-1.5 text-[10px] font-bold tracking-widest text-zinc-400 uppercase"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
