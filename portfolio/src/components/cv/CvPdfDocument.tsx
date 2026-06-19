import {
  Document,
  Link,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import { cvContent } from "@/lib/cv-content";
import { siteConfig } from "@/lib/site";
import type { Experience } from "@/lib/cv-content";
import {
  createCvPdfStyles,
  type CvPdfStyles,
  type CvPdfTheme,
} from "./cv-pdf-styles";

type CvPdfDocumentProps = {
  theme?: CvPdfTheme;
};

function PageChrome({ s }: { s: CvPdfStyles }) {
  return (
    <>
      <View style={s.accentBar} fixed />
      <View style={s.topStripe} fixed />
    </>
  );
}

function PageFooter({ s }: { s: CvPdfStyles }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>
        {siteConfig.name} · Editor de Vídeo · {siteConfig.url}
      </Text>
      <Text style={s.footerText}>
        Premiere Pro · After Effects · ElevenLabs · IA
      </Text>
    </View>
  );
}

function JobEntry({ job, s }: { job: Experience; s: CvPdfStyles }) {
  return (
    <View style={s.job}>
      <View style={s.jobHeader}>
        <Text style={s.jobRole}>{job.role}</Text>
        <Text style={s.jobPeriod}>{job.period}</Text>
      </View>
      <Text style={s.jobCompany}>{job.company}</Text>
      {"audience" in job && job.audience ? (
        <Text style={s.jobAudience}>{job.audience}</Text>
      ) : null}
      <Text style={s.jobLocation}>{job.location}</Text>
      <Text style={s.jobDescription}>{job.description}</Text>
      {job.highlights.map((item) => (
        <View key={item} style={s.highlightRow}>
          <View style={s.bullet} />
          <Text style={s.highlightText}>{item}</Text>
        </View>
      ))}
      <View style={s.toolsRow}>
        {job.tools.map((tool) => (
          <View key={tool} style={s.toolPill}>
            <Text style={s.toolText}>{tool}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function CvPdfDocument({ theme = "dark" }: CvPdfDocumentProps) {
  const s = createCvPdfStyles(theme);
  const brands = cvContent.featuredWork.map((item) => item.brand);
  const [receitas, w7m, novik] = cvContent.experience;

  return (
    <Document
      title={`${siteConfig.name} — Currículo`}
      author={siteConfig.name}
      subject="Editor de Vídeo · eSports & Campanhas"
    >
      <Page size="A4" style={s.page}>
        <PageChrome s={s} />

        <View style={s.header}>
          <Text style={s.eyebrow}>Currículo Profissional · Audiovisual</Text>

          <View style={s.identityBlock}>
            <Text style={s.name}>{siteConfig.name.toUpperCase()}</Text>
            <Text style={s.role}>{cvContent.role}</Text>
          </View>

          <View style={s.contactBlock}>
            <Text style={s.contactLine}>
              <Link src={`mailto:${siteConfig.email}`} style={s.contactLink}>
                {siteConfig.email}
              </Link>
              {" · "}
              {siteConfig.phoneDisplay}
            </Text>
            <Text style={s.contactLine}>
              {siteConfig.location}
              {" · "}
              <Link src={siteConfig.youtube} style={s.contactLink}>
                {siteConfig.youtubeHandle}
              </Link>
            </Text>
          </View>

          <View style={s.statsRow}>
            <View style={s.statBox}>
              <Text style={s.statValue}>2,1M+</Text>
              <Text style={s.statLabel}>Inscritos · Receitas Aprenda</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statValue}>60K+</Text>
              <Text style={s.statLabel}>Inscritos · W7M Esports</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statValue}>13+ anos</Text>
              <Text style={s.statLabel}>Edição de vídeo</Text>
            </View>
          </View>
        </View>

        <Text style={s.sectionTitle}>Perfil</Text>
        <Text style={s.summary}>{cvContent.summary}</Text>
        <Text style={s.tagline}>{cvContent.tagline}</Text>

        <Text style={s.sectionTitle}>Experiência Profissional</Text>
        <JobEntry job={receitas} s={s} />
        <JobEntry job={w7m} s={s} />

        <PageFooter s={s} />
      </Page>

      <Page size="A4" style={s.page}>
        <PageChrome s={s} />

        <Text style={s.continuationLabel}>
          {siteConfig.name} · Experiência (continuação)
        </Text>

        <JobEntry job={novik} s={s} />

        <Text style={s.sectionTitle}>Marcas & Projetos</Text>
        <View style={s.brandGrid}>
          {brands.map((brand) => (
            <View key={brand} style={s.brandPill}>
              <Text style={s.brandText}>{brand}</Text>
            </View>
          ))}
        </View>

        <View style={s.twoCol}>
          <View style={s.col}>
            <Text style={s.sectionTitle}>Competências</Text>
            {cvContent.skillCategories.map((cat) => (
              <View key={cat.title} style={s.skillCategory}>
                <Text style={s.skillCategoryTitle}>{cat.title}</Text>
                <View style={s.toolsRow}>
                  {cat.skills.map((skill) => (
                    <View key={skill} style={s.toolPill}>
                      <Text style={s.toolText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          <View style={s.col}>
            <Text style={s.sectionTitle}>Idiomas</Text>
            {cvContent.languages.map((lang) => (
              <View key={lang.name} style={s.langRow}>
                <Text style={s.langName}>{lang.name}</Text>
                <Text style={s.langLevel}>{lang.level}</Text>
              </View>
            ))}

            <Text style={s.sectionTitle}>Disponibilidade</Text>
            <View style={s.availabilityBox}>
              <View style={s.availabilityRow}>
                <Text style={s.availabilityLabel}>Área</Text>
                <Text style={s.availabilityValue}>
                  {cvContent.availability.roles}
                </Text>
              </View>
              <View style={s.availabilityRow}>
                <Text style={s.availabilityLabel}>Contrato</Text>
                <Text style={s.availabilityValue}>
                  {cvContent.availability.contract}
                </Text>
              </View>
              <View style={s.availabilityRow}>
                <Text style={s.availabilityLabel}>Carga horária</Text>
                <Text style={s.availabilityValue}>
                  {cvContent.availability.schedule}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <PageFooter s={s} />
      </Page>
    </Document>
  );
}

export type { CvPdfTheme };
