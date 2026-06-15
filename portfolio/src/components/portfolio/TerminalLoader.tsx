"use client";

import { useEffect, useState } from "react";
import { cvContent } from "@/lib/cv-content";

type TerminalLoaderProps = {
  onComplete: () => void;
};

export function TerminalLoader({ onComplete }: TerminalLoaderProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const bootSequence = [...cvContent.bootSequence];
    let currentLog = 0;

    const logInterval = setInterval(() => {
      if (currentLog < bootSequence.length) {
        setLogs((prev) => [...prev, bootSequence[currentLog]]);
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
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-end overflow-hidden bg-zinc-950 p-8 font-mono text-zinc-500 ${isGlitching ? "glitch-extreme" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Carregando portfólio de Matheus Nascimento"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="w-full max-w-2xl">
        {logs.map((log, index) => (
          <div key={index} className="mb-2 flex items-center gap-2">
            <span className="text-red-600">{">"}</span>
            <span
              className={
                index === logs.length - 1
                  ? "animate-pulse font-bold text-white"
                  : "text-zinc-400"
              }
            >
              {log}
            </span>
          </div>
        ))}
        <div className="relative mt-6 h-1 w-full overflow-hidden bg-zinc-900">
          <div
            className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-right text-xs text-zinc-600">
          RENDERIZANDO {progress}%
        </div>
      </div>
    </div>
  );
}
