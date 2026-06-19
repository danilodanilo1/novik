"use client";

import { Download, Loader2, Printer } from "lucide-react";
import { useCallback, useState } from "react";
import type { CvPdfTheme } from "@/components/cv/CvPdfDocument";
import { siteConfig } from "@/lib/site";

type CvDownloadGroupProps = {
  /** Contexto visual da seção onde os botões aparecem */
  surface?: "dark" | "light";
  className?: string;
};

const fileNames: Record<CvPdfTheme, string> = {
  dark: siteConfig.cvFileName,
  print: siteConfig.cvPrintFileName,
};

export function CvDownloadGroup({
  surface = "dark",
  className = "",
}: CvDownloadGroupProps) {
  const [loadingTheme, setLoadingTheme] = useState<CvPdfTheme | null>(null);

  const handleDownload = useCallback(
    async (theme: CvPdfTheme) => {
      if (loadingTheme) return;

      setLoadingTheme(theme);

      try {
        const [{ pdf }, { CvPdfDocument }] = await Promise.all([
          import("@react-pdf/renderer"),
          import("./CvPdfDocument"),
        ]);

        const blob = await pdf(<CvPdfDocument theme={theme} />).toBlob();
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = fileNames[theme];
        anchor.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Erro ao gerar currículo PDF:", error);
      } finally {
        setLoadingTheme(null);
      }
    },
    [loadingTheme],
  );

  const isDarkLoading = loadingTheme === "dark";
  const isPrintLoading = loadingTheme === "print";
  const isBusy = loadingTheme !== null;

  const primaryStyles =
    surface === "light"
      ? "interactive inline-flex items-center justify-center gap-2 border border-zinc-300 bg-white px-8 py-4 text-sm font-bold tracking-widest text-black uppercase transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      : "interactive inline-flex items-center justify-center gap-2 border border-zinc-700 bg-zinc-900/80 px-8 py-4 text-sm font-bold tracking-widest text-white uppercase transition-all hover:border-red-500/60 hover:bg-red-600/10 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] disabled:cursor-not-allowed disabled:opacity-60";

  const subtleStyles =
    surface === "light"
      ? "interactive inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-zinc-500 underline-offset-4 transition-colors hover:text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
      : "interactive inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-zinc-500 underline-offset-4 transition-colors hover:text-red-400 hover:underline disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className={`flex flex-col items-start gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => handleDownload("dark")}
        disabled={isBusy}
        aria-busy={isDarkLoading}
        aria-label="Baixar currículo em PDF"
        className={primaryStyles}
      >
        {isDarkLoading ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          <Download size={16} aria-hidden="true" />
        )}
        {isDarkLoading ? "Gerando…" : "Currículo"}
      </button>

      <button
        type="button"
        onClick={() => handleDownload("print")}
        disabled={isBusy}
        aria-busy={isPrintLoading}
        aria-label="Baixar CV para impressão"
        className={subtleStyles}
      >
        {isPrintLoading ? (
          <Loader2 size={12} className="animate-spin" aria-hidden="true" />
        ) : (
          <Printer size={12} aria-hidden="true" />
        )}
        {isPrintLoading ? "Gerando…" : "Baixar CV para impressão"}
      </button>
    </div>
  );
}
