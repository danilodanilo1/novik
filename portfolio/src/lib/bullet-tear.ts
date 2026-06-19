import gsap from "gsap";

const TEAR_HALF = 2.8;
const BULLET_PHASE = 0.88;

/**
 * Onde a ponta prata está dentro do sprite (% da largura da bala).
 * Deve bater com object-position no globals.css (~mesmo valor em %).
 */
export const METALLIC_TIP_RATIO = 0.15;

/** Centro do fogo — atrás da ponta, para a direita (% da largura da bala). */
export const FIRE_BEHIND_TIP_RATIO = 0.2;

/** Largura do `<` na ponta (% da largura da bala). Braços abrem para a direita (atrás da bala). */
export const TEAR_CHEVRON_RATIO = 0.028;

function bulletWidthVw(bulletWrap: HTMLElement): number {
  const sprite = bulletWrap.querySelector(".bullet-sprite-crop--left");
  if (!sprite) return 15;
  return (sprite.getBoundingClientRect().width / window.innerWidth) * 100;
}

function buildHorizontalJaggedEdge(
  xStart: number,
  yStart: number,
  xEnd: number,
  yEnd: number,
  steps: number,
  skipFirst = false,
): string[] {
  const points: string[] = [];

  for (let i = skipFirst ? 1 : 0; i <= steps; i++) {
    const t = i / steps;
    const x = xStart + (xEnd - xStart) * t;
    const y = yStart + (yEnd - yStart) * t;
    const jag = Math.sin(i * 2.7) * 0.35 + Math.cos(i * 1.8) * 0.22;
    points.push(`${x + jag * 0.15}vw ${y + jag}%`);
  }

  return points;
}

function corridorTop(x: number, tipX: number, releaseT: number): number {
  const span = Math.max(1, 100 - tipX);
  const open = Math.min(1, Math.max(0, (x - tipX) / span));
  const eased = 1 - Math.pow(1 - open, 1.35);
  const slitHalf = TEAR_HALF * (1 - releaseT);
  return (50 - slitHalf) * (1 - eased) * (1 - releaseT);
}

function corridorBottom(x: number, tipX: number, releaseT: number): number {
  return 100 - corridorTop(x, tipX, releaseT);
}

/** Overlay branco: tudo à esquerda da ponta + faixas em cima/baixo à direita. */
export function buildTearClipPath(
  tipXVw: number,
  releaseT = 0,
  tipArmVw = 0.6,
): string {
  if (tipXVw >= 105 && releaseT <= 0) {
    return "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
  }
  if (releaseT >= 0.999) {
    return "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)";
  }

  const tipX = Math.min(tipXVw, 100);
  const armX = Math.min(100, tipX + tipArmVw);
  const yTopArm = corridorTop(armX, tipX, releaseT);
  const yBottomArm = corridorBottom(armX, tipX, releaseT);
  const yTopRight = corridorTop(100, tipX, releaseT);
  const yBottomRight = corridorBottom(100, tipX, releaseT);

  const topEdge = buildHorizontalJaggedEdge(
    100,
    yTopRight,
    armX,
    yTopArm,
    8,
    false,
  );
  const bottomEdge = buildHorizontalJaggedEdge(
    armX,
    yBottomArm,
    100,
    yBottomRight,
    8,
    true,
  );

  // `<` apontando para a esquerda: vértice na ponta, braços para trás (direita).
  const points = [
    "0% 0%",
    "100% 0%",
    ...topEdge,
    `${armX}vw ${yTopArm}%`,
    `${tipX}vw 50%`,
    `${armX}vw ${yBottomArm}%`,
    ...bottomEdge,
    "100% 100%",
    "0% 100%",
  ];

  return `polygon(${points.join(", ")})`;
}

function fireTrailOpacity(progress: number): number {
  if (progress <= 0 || progress >= 1) return 0;

  const fadeIn = Math.min(1, progress / 0.06);
  const fadeOut =
    progress > 0.55 ? 1 - Math.pow((progress - 0.55) / 0.45, 1.4) : 1;
  const flicker = 0.78 + Math.sin(progress * 28) * 0.1;

  return fadeIn * fadeOut * flicker;
}

export function applyBulletTear(
  tearProgress: number,
  overlay: HTMLElement,
  bulletWrap: HTMLElement,
  fireTrail: HTMLElement,
  fireCore: HTMLElement,
) {
  const bulletT = Math.min(1, tearProgress / BULLET_PHASE);
  const releaseT =
    tearProgress <= BULLET_PHASE
      ? 0
      : (tearProgress - BULLET_PHASE) / (1 - BULLET_PHASE);

  const widthVw = bulletWidthVw(bulletWrap);
  const travelEndVw = 108 - 125;
  const exitVw = -(widthVw + 1.5);
  const baseTrackVw = 108 - bulletT * 125;
  const trackVw =
    releaseT > 0
      ? travelEndVw + (exitVw - travelEndVw) * releaseT
      : baseTrackVw;

  const bulletVisible = trackVw + widthVw > 0;

  gsap.set(bulletWrap, {
    left: `${trackVw}vw`,
    opacity: bulletVisible ? 1 : 0,
    force3D: true,
  });

  const tearXVw = trackVw + widthVw * METALLIC_TIP_RATIO;
  const fireXVw = trackVw + widthVw * FIRE_BEHIND_TIP_RATIO;
  const chevronArmVw = widthVw * TEAR_CHEVRON_RATIO;

  overlay.style.clipPath = buildTearClipPath(
    releaseT > 0 ? Math.min(tearXVw, -4) : tearXVw,
    releaseT,
    chevronArmVw,
  );

  const trailOpacity = bulletVisible ? fireTrailOpacity(bulletT) : 0;
  const rawTrailWidth = Math.max(0, 108 - fireXVw);
  const trailShrink =
    bulletT > 0.5 ? 1 - Math.pow((bulletT - 0.5) / 0.5, 1.2) * 0.35 : 1;

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
  overlay.style.clipPath = fullyOpen
    ? buildTearClipPath(-5, 1)
    : buildTearClipPath(108);
}
