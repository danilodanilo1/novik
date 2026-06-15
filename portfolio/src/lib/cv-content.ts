export const cvContent = {
  summary:
    "Editor de vídeo com referência no cenário eSports brasileiro. Mais de cinco anos na W7M Gaming produzindo conteúdo para YouTube, Reels e campanhas de marcas como Netflix, Banco do Brasil, iFood e Mercado Livre. Hoje lidera pós-produção multilíngue com IA na Receitas Aprenda.",

  role: "Editor de Vídeo · eSports & Campanhas",

  tagline:
    "Do hype competitivo ao storytelling corporativo — ritmo, narrativa e escala global.",

  experience: [
    {
      company: "Receitas Aprenda Empreendimentos Digitais",
      role: "Editor de Vídeo",
      location: "São Paulo, SP",
      period: "Fev 2024 — Jun 2026",
      description:
        "Responsável pela edição de vídeos de receitas culinárias, criação de narrações com inteligência artificial via ElevenLabs e adaptação de conteúdo para cinco idiomas. Utiliza Adobe Premiere Pro e fluxos assistidos por ChatGPT para acelerar roteiro, tradução e pós-produção em escala.",
      highlights: [
        "Edição de receitas para múltiplas plataformas",
        "Narração sintética com ElevenLabs",
        "Localização em 5 idiomas",
      ],
      tools: ["Adobe Premiere Pro", "ElevenLabs", "ChatGPT"],
    },
    {
      company: "W7M Esports",
      role: "Editor de Vídeo",
      location: "São Paulo, SP",
      period: "Out 2018 — Out 2023",
      description:
        "Editor principal de conteúdos para YouTube, Reels e redes sociais da organização e de marcas parceiras. Atuou em campanhas publicitárias para Netflix, Banco do Brasil, iFood e Mercado Livre, além de cobertura de eventos, feiras gamer e produções para patrocinadores do cenário eSports.",
      highlights: [
        "Campanhas AAA com grandes marcas",
        "Highlights e fragmovies competitivos",
        "Cobertura de eventos e feiras gamer",
      ],
      tools: [
        "Adobe Premiere Pro",
        "Adobe After Effects",
        "Sony Vegas",
        "Adobe Photoshop",
      ],
    },
    {
      company: "Locaweb",
      role: "Analista de Suporte",
      location: "São Paulo, SP",
      period: "Jan 2018 — Out 2018",
      description:
        "Suporte técnico a clientes de hospedagem: criação de sites, configuração de e-mails e resolução de chamados. Experiência que reforça visão de entrega digital ponta a ponta.",
      highlights: [
        "Suporte a hospedagem e e-mail",
        "Atendimento e gestão de chamados",
      ],
      tools: ["Windows"],
    },
  ],

  featuredWork: [
    {
      brand: "NETFLIX",
      title: "Campanhas Promocionais",
      desc: "Edição de peças promocionais dentro de campanhas publicitárias da W7M, traduzindo a linguagem cinematográfica da marca para formatos dinâmicos de YouTube e Reels sem perder impacto visual.",
      accent: "text-[#E50914]",
      tag: "Streaming",
      image:
        "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2069&auto=format&fit=crop",
    },
    {
      brand: "BANCO DO BRASIL",
      title: "Institucional Moderno",
      desc: "Produção audiovisual para campanhas institucionais, conectando a credibilidade de uma das maiores instituições financeiras do país a um público jovem e digital com edição ágil e narrativa clara.",
      accent: "text-[#F9ED32]",
      tag: "Institucional",
      image:
        "https://images.unsplash.com/photo-1616803140344-6682afb13cda?q=80&w=2070&auto=format&fit=crop",
    },
    {
      brand: "IFOOD",
      title: "Marcas Parceiras",
      desc: "Conteúdo editado para campanhas de patrocínio e ativações de marca no ecossistema eSports, integrando produto, lifestyle e entretenimento em vídeos de alta retenção para redes sociais.",
      accent: "text-[#EA1D2C]",
      tag: "Patrocínio",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
    },
    {
      brand: "MERCADO LIVRE",
      title: "Ativações Digitais",
      desc: "Edição de vídeos para campanhas e ações promocionais com marcas parceiras da W7M, com foco em engajamento, clareza de mensagem e ritmo pensado para plataformas verticais e horizontais.",
      accent: "text-[#FFE600]",
      tag: "E-commerce",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop",
    },
    {
      brand: "W7M ESPORTS",
      title: "O Coração do eSports",
      desc: "Cinco anos definindo o padrão visual da organização: highlights, fragmovies, coberturas de eventos e conteúdo diário para YouTube e Reels — sempre com sync de áudio preciso e energia competitiva.",
      accent: "text-red-600",
      tag: "Gaming",
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
    },
  ],

  skillCategories: [
    {
      title: "Edição & Pós-Produção",
      skills: [
        "Adobe Premiere Pro",
        "Adobe After Effects",
        "Adobe Photoshop",
        "Sony Vegas",
        "Edição de Vídeo",
      ],
    },
    {
      title: "Inteligência Artificial",
      skills: ["ElevenLabs", "ChatGPT", "Narração com IA", "Localização"],
    },
    {
      title: "Formatos & Plataformas",
      skills: [
        "YouTube",
        "Reels & Shorts",
        "Redes Sociais",
        "Campanhas Publicitárias",
        "Eventos eSports",
      ],
    },
  ],

  languages: [
    { name: "Português", level: "Nativo" },
    { name: "Inglês", level: "Intermediário" },
  ],

  availability: {
    roles: "Audiovisual",
    contract: "Prestador de Serviços (PJ)",
    schedule: "Período Integral",
  },
} as const;

export type FeaturedWork = (typeof cvContent.featuredWork)[number];
export type Experience = (typeof cvContent.experience)[number];
