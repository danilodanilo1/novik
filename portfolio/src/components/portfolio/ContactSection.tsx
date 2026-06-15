import { Mail, MapPin, Phone } from "lucide-react";
import { cvContent } from "@/lib/cv-content";
import { siteConfig } from "@/lib/site";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative z-10 border-t border-zinc-800 bg-[#050505] px-6 py-24 md:px-20"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 font-mono text-xs tracking-[0.4em] text-red-600 uppercase">
              Disponível · {cvContent.availability.contract}
            </p>
            <h2
              id="contact-heading"
              className="text-4xl font-black tracking-tighter text-white md:text-6xl"
            >
              Vamos editar juntos?
            </h2>
            <p className="mt-4 max-w-xl text-lg text-zinc-400">
              {siteConfig.name}, {siteConfig.age} anos — editor de vídeo em{" "}
              {siteConfig.location}. Busco oportunidades em{" "}
              <strong className="text-zinc-300">
                {cvContent.availability.roles}
              </strong>
              , em regime de{" "}
              <strong className="text-zinc-300">
                {cvContent.availability.schedule.toLowerCase()}
              </strong>
              .
            </p>
          </div>
          <a
            href={`mailto:${siteConfig.email}?subject=Proposta%20Audiovisual%20-%20Matheus%20Nascimento`}
            className="interactive inline-flex items-center justify-center bg-red-600 px-10 py-4 text-sm font-bold tracking-widest text-white uppercase transition-colors hover:bg-red-500"
          >
            Enviar proposta
          </a>
        </div>

        <address className="grid gap-8 not-italic md:grid-cols-3">
          <a
            href={`mailto:${siteConfig.email}`}
            className="interactive group border border-zinc-800 p-8 transition-colors hover:border-red-500/50"
          >
            <Mail
              className="mb-4 text-red-500 transition-transform group-hover:scale-110"
              size={28}
              aria-hidden="true"
            />
            <p className="mb-2 text-xs tracking-widest text-zinc-500 uppercase">
              E-mail
            </p>
            <p className="text-lg font-semibold text-white">{siteConfig.email}</p>
          </a>

          <a
            href={`tel:${siteConfig.phone}`}
            className="interactive group border border-zinc-800 p-8 transition-colors hover:border-red-500/50"
          >
            <Phone
              className="mb-4 text-red-500 transition-transform group-hover:scale-110"
              size={28}
              aria-hidden="true"
            />
            <p className="mb-2 text-xs tracking-widest text-zinc-500 uppercase">
              WhatsApp / Telefone
            </p>
            <p className="text-lg font-semibold text-white">
              {siteConfig.phoneDisplay}
            </p>
          </a>

          <div className="border border-zinc-800 p-8">
            <MapPin className="mb-4 text-red-500" size={28} aria-hidden="true" />
            <p className="mb-2 text-xs tracking-widest text-zinc-500 uppercase">
              Localização
            </p>
            <p className="text-lg font-semibold text-white">
              {siteConfig.location}
            </p>
            <p className="mt-1 text-sm text-zinc-500">{siteConfig.address}</p>
          </div>
        </address>

        <footer className="mt-20 flex flex-col gap-4 border-t border-zinc-900 pt-10 text-sm text-zinc-600 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Portfólio &
            currículo profissional.
          </p>
          <p className="font-mono text-xs tracking-widest uppercase">
            Premiere Pro · After Effects · Photoshop · Sony Vegas · ElevenLabs
          </p>
        </footer>
      </div>
    </section>
  );
}
