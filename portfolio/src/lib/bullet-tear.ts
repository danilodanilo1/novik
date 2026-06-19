import gsap from "gsap";

/** Meia-abertura do V em % — braços estreitos na ponta da bala. */
const TEAR_HALF = 2.8;

/** Progresso do rasgo (0–1): fim do percurso horizontal da bala. */
export const TRAVEL_END = 0.48;
/** Bala totalmente invisível — só depois disso o rasgo abre sozinho. */
export const BULLET_GONE = 0.56;

/**
 * Onde a ponta prata está dentro do sprite (% da largura da bala).
 * Deve bater com object-position no globals.css (~mesmo valor em %).
 */
export const METALLIC_TIP_RATIO = 0.15;

/** Centro do fogo — atrás da ponta, para a direita (% da largura da bala). */
export const FIRE_BEHIND_TIP_RATIO = 0.2;

function bulletWidthVw(bulletWrap: HTMLElement): number {
  const sprite = bulletWrap.querySelector(".bullet-sprite-crop--left");
  if (!sprite) return 15;
  return (sprite.getBoundingClientRect().width / window.innerWidth) * 100;
}

function buildJaggedSegment(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  steps: number,
  skipFirst = false,
): string[] {
  const points: string[] = [];

  for (let i = skipFirst ? 1 : 0; i <= steps; i++) {
    const s = i / steps;
    const x = x1 + (x2 - x1) * s;
    const y = y1 + (y2 - y1) * s;
    const jag = Math.sin(i * 2.4) * 0.5 + Math.cos(i * 1.6) * 0.35;
    points.push(`${x + jag}vw ${y}%`);
  }

  return points;
}

function easeOut(u: number, power = 1.35): number {
  return 1 - Math.pow(1 - u, power);
}

/** Clip-path que não desenha overlay nenhum (rasgo 100% aberto). */
export function buildFullyOpenClipPath(): string {
  return "polygon(0% 50%, 0% 50%, 0% 50%)";
}

/** Overlay claro: V na ponta; braços até a borda direita. */
export function buildTearClipPath(tipXVw: number, spread = TEAR_HALF): string {
  if (tipXVw >= 105 && spread <= TEAR_HALF + 0.01) {
    return "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
  }

  const yTop = 50 - spread;
  const yBot = 50 + spread;

  const topArm = buildJaggedSegment(100, yTop, tipXVw, 50, 8, true);
  const bottomArm = buildJaggedSegment(tipXVw, 50, 100, yBot, 8, true);

  const points = [
    "0% 0%",
    "100% 0%",
    `100% ${yTop}%`,
    ...topArm,
    ...bottomArm,
    `100% ${yBot}%`,
    "100% 100%",
    "0% 100%",
  ];

  return `polygon(${points.join(", ")})`;
}

/** Abertura só para frente: vertical → ápice desliza para a esquerda. */
function widenGeometry(openT: number, apexAtTravelEnd: number) {
  if (openT <= 0) {
    return { spread: TEAR_HALF, apexX: apexAtTravelEnd };
  }

  const VERT_PHASE = 0.7;

  if (openT < VERT_PHASE) {
    const u = openT / VERT_PHASE;
    return {
      spread: TEAR_HALF + easeOut(u) * (50 - TEAR_HALF),
      apexX: apexAtTravelEnd,
    };
  }

  const tailU = (openT - VERT_PHASE) / (1 - VERT_PHASE);
  return {
    spread: 50,
    apexX: apexAtTravelEnd - easeOut(tailU) * 115,
  };
}

function fireTrailOpacity(progress: number): number {
  if (progress <= 0 || progress >= 1) return 0;

  const fadeIn = Math.min(1, progress / 0.06);
  const fadeOut =
    progress > 0.55 ? 1 - Math.pow((progress - 0.55) / 0.45, 1.4) : 1;
  const flicker = 0.78 + Math.sin(progress * 28) * 0.1;

  return fadeIn * fadeOut * flicker;
}

function hideBulletVisuals(
  bulletWrap: HTMLElement,
  fireTrail: HTMLElement,
  fireCore: HTMLElement,
) {
  gsap.set(bulletWrap, { opacity: 0, force3D: true });
  gsap.set(fireTrail, { opacity: 0, width: 0 });
  gsap.set(fireCore, { opacity: 0, scale: 1 });
}

/**
 * Rasgo contínuo:
 * 1. Bala percorre com V estreito na ponta
 * 2. Bala some
 * 3. Rasgo abre verticalmente, depois o ápice avança — só abre, nunca fecha
 */
export function applyTearAnimation(
  tearProgress: number,
  overlay: HTMLElement,
  bulletWrap: HTMLElement,
  fireTrail: HTMLElement,
  fireCore: HTMLElement,
): number {
  const p = Math.min(1, Math.max(0, tearProgress));
  const widthVw = bulletWidthVw(bulletWrap);

  const travelT = Math.min(1, p / TRAVEL_END);
  const trackVw = p <= TRAVEL_END ? 108 - travelT * 125 : 108 - 125;
  const tipXVw = trackVw + widthVw * METALLIC_TIP_RATIO;
  const apexAtTravelEnd = 108 - 125 + widthVw * METALLIC_TIP_RATIO;

  const widenU =
    p <= BULLET_GONE ? 0 : (p - BULLET_GONE) / (1 - BULLET_GONE);
  const openT = widenU <= 0 ? 0 : easeOut(widenU);

  const clipPath =
    p <= BULLET_GONE
      ? buildTearClipPath(tipXVw, TEAR_HALF)
      : (() => {
          const { spread, apexX } = widenGeometry(openT, apexAtTravelEnd);
          return buildTearClipPath(apexX, spread);
        })();

  overlay.style.clipPath = clipPath;
  gsap.set(overlay, { opacity: 1, visibility: "visible" });

  let bulletOpacity = 1;
  const fireT = travelT;
  if (p > BULLET_GONE) {
    bulletOpacity = 0;
  } else if (p > TRAVEL_END) {
    bulletOpacity = 1 - (p - TRAVEL_END) / (BULLET_GONE - TRAVEL_END);
  }

  if (bulletOpacity <= 0) {
    hideBulletVisuals(bulletWrap, fireTrail, fireCore);
  } else {
    gsap.set(bulletWrap, {
      left: `${trackVw}vw`,
      opacity: bulletOpacity,
      force3D: true,
    });

    const fireXVw = trackVw + widthVw * FIRE_BEHIND_TIP_RATIO;
    const trailOpacity = fireTrailOpacity(fireT) * bulletOpacity;
    const rawTrailWidth = Math.max(0, 108 - fireXVw);
    const trailShrink =
      fireT > 0.5 ? 1 - Math.pow((fireT - 0.5) / 0.5, 1.2) * 0.35 : 1;

    gsap.set(fireTrail, {
      left: `${fireXVw}vw`,
      width: `${rawTrailWidth * trailShrink}vw`,
      opacity: trailOpacity * 0.92,
      force3D: true,
    });

    gsap.set(fireCore, {
      left: `${fireXVw - trackVw}vw`,
      opacity: trailOpacity,
      scale: 0.85 + trailOpacity * 0.2,
    });
  }

  return apexAtTravelEnd;
}

/** Rasgo 100% aberto — pronto para a seção gaming rolar. */
export function finishTearOpen(
  overlay: HTMLElement,
  bulletWrap: HTMLElement,
  fireTrail: HTMLElement,
  fireCore: HTMLElement,
) {
  hideBulletVisuals(bulletWrap, fireTrail, fireCore);
  gsap.set(overlay, {
    opacity: 1,
    visibility: "hidden",
    clipPath: buildFullyOpenClipPath(),
  });
}

export function hideBulletTear(
  overlay: HTMLElement,
  bulletWrap: HTMLElement,
  fireTrail: HTMLElement,
  fireCore: HTMLElement,
  fullyOpen = false,
) {
  gsap.set(bulletWrap, { left: "108vw", opacity: 0, force3D: true });
  gsap.set(fireTrail, { opacity: 0, width: 0 });
  gsap.set(fireCore, { opacity: 0, scale: 1 });
  gsap.set(overlay, {
    opacity: 1,
    visibility: fullyOpen ? "hidden" : "visible",
    clipPath: fullyOpen ? buildFullyOpenClipPath() : buildTearClipPath(108),
  });
}
