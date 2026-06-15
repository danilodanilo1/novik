import React, { useState, useEffect, useRef } from 'react';
import { Play, ChevronDown, Cpu, MonitorPlay, FastForward } from 'lucide-react';

const CustomStyles = () => (
  <style>{`
    .noise-bg {
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }

    .glitch-extreme {
      animation: extreme-glitch 0.2s cubic-bezier(.25, .46, .45, .94) both infinite;
      filter: contrast(200%) brightness(150%) hue-rotate(90deg);
    }
    
    @keyframes extreme-glitch {
      0% { transform: translate(0) scale(1); opacity: 1; }
      20% { transform: translate(-10px, 10px) scale(1.05); opacity: 0.8; }
      40% { transform: translate(-10px, -10px) scale(0.95); opacity: 0.9; }
      60% { transform: translate(10px, 10px) scale(1.1); opacity: 1; }
      80% { transform: translate(10px, -10px) scale(0.9); opacity: 0.8; }
      100% { transform: translate(0) scale(1); opacity: 1; }
    }

    .zoom-through-o {
      transform-origin: 85% 75%; 
      will-change: transform, opacity;
    }

    .video-montage-bg {
      background: linear-gradient(45deg, #050505, #1a0000, #050505, #220000);
      background-size: 400% 400%;
      animation: gradientMontage 0.3s ease infinite;
    }
    
    @keyframes gradientMontage {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .glitch-text {
      position: relative;
    }
    .glitch-text::before,
    .glitch-text::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
    .glitch-text:hover::before {
      left: 2px;
      text-shadow: -2px 0 red;
      animation: glitch-anim-1 2s infinite linear alternate-reverse;
      opacity: 1;
    }
    .glitch-text:hover::after {
      left: -2px;
      text-shadow: 2px 0 blue;
      animation: glitch-anim-2 3s infinite linear alternate-reverse;
      opacity: 1;
    }

    @keyframes glitch-anim-1 {
      0% { clip-path: inset(20% 0 80% 0); }
      20% { clip-path: inset(60% 0 10% 0); }
      40% { clip-path: inset(40% 0 50% 0); }
      60% { clip-path: inset(80% 0 5% 0); }
      80% { clip-path: inset(10% 0 70% 0); }
      100% { clip-path: inset(30% 0 20% 0); }
    }
    @keyframes glitch-anim-2 {
      0% { clip-path: inset(10% 0 60% 0); }
      20% { clip-path: inset(30% 0 20% 0); }
      40% { clip-path: inset(70% 0 10% 0); }
      60% { clip-path: inset(20% 0 50% 0); }
      80% { clip-path: inset(50% 0 30% 0); }
      100% { clip-path: inset(5% 0 80% 0); }
    }

    .perspective-1000 {
      perspective: 1000px;
    }

    html, body {
      cursor: none;
      scroll-behavior: smooth;
    }
    
    .interactive:hover ~ #cursor-crosshair {
      transform: translate(-50%, -50%) scale(1.5);
      border-color: #ef4444; 
    }
  `}</style>
);

const TerminalLoader = ({ onComplete }) => {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const bootSequence = [
      "Initializing HLAE modules...",
      "Connecting to W7M servers...",
      "Bypassing bitrates...",
      "Mounting Netflix assets...",
      "Syncing audio waveforms...",
      "Injecting AI sequences...",
      "SYSTEM READY."
    ];

    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < bootSequence.length) {
        setLogs(prev => [...prev, bootSequence[currentLog]]);
        setProgress(Math.floor(((currentLog + 1) / bootSequence.length) * 100));
        currentLog++;
      } else {
        clearInterval(logInterval);
        setIsGlitching(true);
        setTimeout(onComplete, 600); 
      }
    }, 300);

    return () => clearInterval(logInterval);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col justify-end p-8 bg-zinc-950 font-mono text-zinc-500 overflow-hidden ${isGlitching ? 'glitch-extreme' : ''}`}>
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      <div className="max-w-2xl w-full">
        {logs.map((log, index) => (
          <div key={index} className="mb-2 flex items-center gap-2">
            <span className="text-red-600">{">"}</span>
            <span className={index === logs.length - 1 ? "text-white font-bold animate-pulse" : "text-zinc-400"}>{log}</span>
          </div>
        ))}
        <div className="h-1 w-full bg-zinc-900 mt-6 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-right text-xs text-zinc-600">RENDERIZANDO {progress}%</div>
      </div>
    </div>
  );
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div 
      id="cursor-crosshair"
      className={`fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference transition-transform duration-100 ease-out flex items-center justify-center ${isClicking ? 'scale-75' : 'scale-100'}`}
      style={{ transform: `translate(${position.x - 16}px, ${position.y - 16}px)` }}
    >
      <div className="absolute w-full h-[2px] bg-white opacity-80" />
      <div className="absolute h-full w-[2px] bg-white opacity-80" />
      <div className="absolute w-1 h-1 bg-red-500 rounded-full" />
    </div>
  );
};

const HeroSection = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) * 2 - 1;
    const y = (clientY / innerHeight) * 2 - 1;
    setMousePos({ x, y });
  };

  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const zoomProgress = Math.min(1, Math.max(0, scrollY / (windowHeight * 0.8)));
  const textScale = 1 + Math.pow(zoomProgress, 3) * 150; 
  const textOpacity = Math.max(0, 1 - Math.pow(zoomProgress, 4)); 
  const bgOpacity = 1 - Math.pow(zoomProgress, 2);

  return (
    <div className="h-[200vh] relative w-full bg-[#f5f5f7]">
      <div className="sr-only">
        <h1>Matheus Nascimento - Filmmaker & Video Editor</h1>
        <h2>Portfólio de Edição de Vídeo: Netflix, Banco do Brasil, eSports W7M</h2>
        <p>Especialista na interseção entre campanhas institucionais modernas e o ritmo agressivo dos eSports.</p>
      </div>

      <div 
        className="sticky top-0 h-screen w-full overflow-hidden perspective-1000 bg-zinc-950 flex items-center justify-center"
        onMouseMove={handleMouseMove}
        style={{ opacity: bgOpacity }}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none noise-bg z-10 mix-blend-overlay" />
        <div className="absolute inset-0 video-montage-bg opacity-40 z-0" />
        
        <div 
          className="relative z-20 text-center zoom-through-o flex flex-col items-center justify-center"
          style={{ 
            transform: `scale(${textScale}) rotateY(${mousePos.x * 12}deg) rotateX(${-mousePos.y * 12}deg)`,
            opacity: textOpacity
          }}
        >
          <p className="text-red-600 tracking-[0.5em] text-xs md:text-sm mb-4 font-bold uppercase drop-shadow-[0_0_15px_rgba(220,38,38,1)]">
            Filmmaker & Video Editor
          </p>
          <h2 className="text-white font-black text-[10vw] leading-none tracking-tighter mix-blend-difference interactive cursor-none select-none flex flex-col items-center">
            <span className="block hover:text-red-500 transition-colors duration-300 glitch-text" data-text="MATHEUS">MATHEUS</span>
            <span className="block ml-12 text-zinc-300 hover:text-white transition-colors duration-300 glitch-text" data-text="NASCIMENTO">
              NASCIMENT<span className="text-red-600">O</span>
            </span>
          </h2>
        </div>

        <div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500 animate-bounce transition-opacity duration-300"
          style={{ opacity: 1 - zoomProgress * 5 }}
        >
          <span className="text-[10px] tracking-widest uppercase font-mono">Scroll to initialize</span>
          <ChevronDown size={20} />
        </div>
      </div>
    </div>
  );
};

const HorizontalGallery = () => {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollableDistance = height - windowHeight;
      const scrolled = -top;
      
      let progress = scrolled / scrollableDistance;
      progress = Math.max(0, Math.min(1, progress)); 
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cases = [
    {
      brand: "NETFLIX",
      title: "Ritmo & Adaptação",
      desc: "Edição de alto impacto para campanhas promocionais, adaptando a linguagem cinematográfica densa para o dinamismo frenético e instantâneo das redes sociais.",
      accent: "text-[#E50914]",
      tag: "Corporate",
      image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2069&auto=format&fit=crop"
    },
    {
      brand: "BANCO DO BRASIL",
      title: "Agilidade Institucional",
      desc: "Quebrando a seriedade corporativa com edições fluidas e modernas que conectam as iniciativas do banco ao público jovem e nativo digital.",
      accent: "text-[#F9ED32]",
      tag: "Commercial",
      image: "https://images.unsplash.com/photo-1616803140344-6682afb13cda?q=80&w=2070&auto=format&fit=crop"
    },
    {
      brand: "W7M ESPORTS",
      title: "The Fragmovie Era",
      desc: "Mais de 5 anos ditando o ritmo do cenário competitivo. Edições frenéticas, sync de áudio perfeito e construção de hype absoluto para mundiais de CS:GO.",
      accent: "text-zinc-800",
      tag: "Gaming",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-[#f5f5f7] z-20 shadow-[0_-30px_50px_rgba(245,245,247,1)]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center bg-[#f5f5f7]">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden">
          <span className="text-[30vw] font-bold text-black whitespace-nowrap transform -translate-x-1/2" style={{ transform: `translateX(${-scrollProgress * 50}%)`, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
            SELECTED WORKS
          </span>
        </div>

        <div 
          className="flex h-[80vh] items-center gap-20 px-[10vw] transition-transform duration-75 ease-out"
          style={{ transform: `translateX(${-scrollProgress * 66.66}%)`, width: '300vw' }}
        >
          {cases.map((work, idx) => {
            const itemPosition = (idx / 2); 
            const distance = Math.abs(scrollProgress - itemPosition);
            const isActive = distance < 0.2;

            return (
              <div key={idx} className={`w-[80vw] md:w-[60vw] h-full shrink-0 flex flex-col md:flex-row gap-12 items-center group interactive transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`relative w-full md:w-[60%] h-[40vh] md:h-[70%] bg-black rounded-3xl overflow-hidden shadow-2xl transition-transform duration-700 ${isActive ? 'scale-100' : 'scale-95'}`}>
                  <img src={work.image} alt={work.brand} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity" loading="lazy" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-white/20">
                        <Play className="text-white ml-2 drop-shadow-lg" fill="currentColor" size={32} />
                     </div>
                  </div>
                  <div className="absolute bottom-6 left-6 flex gap-3">
                    <span className="px-4 py-1.5 backdrop-blur-md bg-black/40 text-white text-[10px] font-bold rounded-full tracking-widest uppercase">
                      4K HDR
                    </span>
                    <span className="px-4 py-1.5 backdrop-blur-md bg-white/20 text-white text-[10px] font-bold rounded-full tracking-widest uppercase">
                      {work.tag}
                    </span>
                  </div>
                </div>

                <div className="w-full md:w-[40%] flex flex-col justify-center text-black">
                  <span className={`text-sm font-black tracking-widest uppercase mb-4 drop-shadow-sm ${work.accent}`}>
                    {work.brand}
                  </span>
                  <h2 className="text-5xl md:text-7xl font-black mb-6 leading-none tracking-tighter" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                    {work.title}
                  </h2>
                  <p className="text-zinc-600 text-lg md:text-xl leading-relaxed font-medium">
                    {work.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CurrentProjects = () => {
  const sectionRef = useRef(null);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const { top } = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (top < windowHeight * 0.6 && top > 0) {
        if (Math.floor(top) % 60 < 10) {
          setIsFlashing(true);
        } else {
          setIsFlashing(false);
        }
      } else {
        setIsFlashing(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={sectionRef} 
      className={`w-full py-32 px-6 md:px-20 relative z-10 transition-colors duration-75 ${isFlashing ? 'bg-zinc-900' : 'bg-[#050505]'}`}
    >
      <div className="absolute top-10 right-10 flex items-center gap-2 text-zinc-500 text-[10px] font-mono tracking-widest animate-pulse">
        <div className="w-2 h-2 rounded-full bg-red-600"></div>
        TURN AUDIO ON [SIMULATION]
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-zinc-800 pb-10">
          <div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">THE IMPACT ZONE</h2>
            <p className="text-zinc-400 mt-4 text-lg">Edição rítmica, Inteligência Artificial e Localização Global.</p>
          </div>
          <a href="#contact" className="mt-8 md:mt-0 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-red-600 hover:text-white transition-colors duration-300 interactive flex items-center gap-2">
            Deploy Project <FastForward size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 perspective-1000">
          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 p-10 hover:border-red-500/50 hover:shadow-[0_0_40px_rgba(220,38,38,0.15)] hover:-translate-y-2 transition-all duration-500 group interactive">
            <Cpu className="text-red-500 mb-6 group-hover:scale-125 transition-transform duration-300" size={40} />
            <h3 className="text-3xl font-bold text-white mb-4">A.I. Workflow & Receitas</h3>
            <p className="text-zinc-400 mb-8 text-lg leading-relaxed">
              Liderando a pós-produção de canais de culinária com tradução e adaptação simultânea para 5 idiomas. 
              Implementação de fluxos de trabalho com ferramentas de IA (ElevenLabs, ChatGPT) para narração realista e escala global.
            </p>
            <div className="flex gap-3 flex-wrap">
              <span className="px-4 py-2 bg-black text-[10px] text-zinc-300 uppercase font-bold tracking-widest rounded-full">Premiere Pro</span>
              <span className="px-4 py-2 bg-black text-[10px] text-red-400 border border-red-900/50 uppercase font-bold tracking-widest rounded-full">ElevenLabs AI</span>
              <span className="px-4 py-2 bg-black text-[10px] text-zinc-300 uppercase font-bold tracking-widest rounded-full">Pipeline Automations</span>
            </div>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 p-10 hover:border-zinc-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:-translate-y-2 transition-all duration-500 group interactive">
            <MonitorPlay className="text-zinc-300 mb-6 group-hover:scale-125 transition-transform duration-300" size={40} />
            <h3 className="text-3xl font-bold text-white mb-4">O Arsenal Cinematográfico</h3>
            <p className="text-zinc-400 mb-8 text-lg leading-relaxed">
              Domínio absoluto de ritmo narrativo. Mais de 5 anos refinando técnicas avançadas para reter atenção (Watch Time) no YouTube, engajar (Hook) no Reels e emocionar em campanhas AAA.
            </p>
            <div className="grid grid-cols-2 gap-y-4 gap-x-4">
              <div className="flex items-center gap-3"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"/> <span className="text-sm font-bold text-zinc-300 tracking-wider">Sound Design</span></div>
              <div className="flex items-center gap-3"><div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"/> <span className="text-sm font-bold text-zinc-300 tracking-wider">Color Grading</span></div>
              <div className="flex items-center gap-3"><div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"/> <span className="text-sm font-bold text-zinc-300 tracking-wider">Motion Graphics</span></div>
              <div className="flex items-center gap-3"><div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"/> <span className="text-sm font-bold text-zinc-300 tracking-wider">In-game Cinematics</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-500 selection:text-white">
      <CustomStyles />
      <CustomCursor />
      
      {!isLoaded ? (
        <TerminalLoader onComplete={() => setIsLoaded(true)} />
      ) : (
        <main className="animate-in fade-in duration-1000">
          <HeroSection />
          <HorizontalGallery />
          <CurrentProjects />
        </main>
      )}
    </div>
  );
}