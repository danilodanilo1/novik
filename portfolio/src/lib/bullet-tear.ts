import gsap from "gsap";

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
    const t = i / steps;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    const jag = Math.sin(i * 2.4) * 0.5 + Math.cos(i * 1.6) * 0.35;
    points.push(`${x + jag}vw ${y}%`);
  }

  return points;
}

export function buildTearClipPath(
  bulletLeftVw: number,
  tearProgress = 1,
): string {
  if (bulletLeftVw >= 105) {
    return "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
  }
  if (bulletLeftVw <= -5) {
    return "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)";
  }

  const armLen = 5 + tearProgress * 58;
  const apexX = bulletLeftVw;
  const tipX = Math.min(102, apexX + armLen);

  const topArm = buildJaggedSegment(tipX, 0, apexX, 50, 8, true);
  const bottomArm = buildJaggedSegment(apexX, 50, tipX, 100, 8, true);

  const points = [
    "0% 0%",
    `${tipX}vw 0%`,
    ...topArm,
    ...bottomArm,
    `${tipX}vw 100%`,
    "0% 100%",
  ];

  return `polygon(${points.join(", ")})`;
}

/** Fade suave: entra rápido, sai gradualmente no final do rasgo. */
function fireTrailOpacity(progress: number): number {
  if (progress <= 0 || progress >= 1) return 0;

  const fadeIn = Math.min(1, progress / 0.06);
  const fadeOut =
    progress > 0.55 ? 1 - Math.pow((progress - 0.55) / 0.45, 1.4) : 1;
  const flicker = 0.78 + Math.sin(progress * 28) * 0.1;

  return fadeIn * fadeOut * flicker;
}

export function applyBulletTear(
  progress: number,
  overlay: HTMLElement,
  bulletWrap: HTMLElement,
  fireTrail: HTMLElement,
  fireCore: HTMLElement,
) {
  const bulletLeftVw = 108 - progress * 118;

  gsap.set(bulletWrap, {
    left: `${bulletLeftVw}vw`,
    force3D: true,
  });
  overlay.style.clipPath = buildTearClipPath(bulletLeftVw, progress);

  const trailOpacity = fireTrailOpacity(progress);
  const rawTrailWidth = Math.max(0, 108 - bulletLeftVw);
  const trailShrink =
    progress > 0.5 ? 1 - Math.pow((progress - 0.5) / 0.5, 1.2) * 0.35 : 1;

  gsap.set(fireTrail, {
    left: `${bulletLeftVw}vw`,
    width: `${rawTrailWidth * trailShrink}vw`,
    opacity: trailOpacity * 0.92,
    force3D: true,
  });

  gsap.set(fireCore, {
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
  gsap.set(bulletWrap, { left: "108vw", force3D: true });
  gsap.set(fireTrail, { opacity: 0, width: 0 });
  gsap.set(fireCore, { opacity: 0, scale: 1 });
  overlay.style.clipPath = fullyOpen
    ? buildTearClipPath(-5, 1)
    : buildTearClipPath(108, 0);
}
