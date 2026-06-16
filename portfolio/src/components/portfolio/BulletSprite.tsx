import Image from "next/image";

type BulletSpriteProps = {
  className?: string;
  /** Bala se move da direita para a esquerda — PNG original aponta para a direita. */
  direction?: "left" | "right";
};

export function BulletSprite({
  className = "",
  direction = "left",
}: BulletSpriteProps) {
  const isLeft = direction === "left";

  return (
    <div
      className={`bullet-sprite-crop ${isLeft ? "bullet-sprite-crop--left" : "bullet-sprite-crop--right"} ${className}`}
    >
      <Image
        src="/pngegg.png"
        alt=""
        width={640}
        height={160}
        aria-hidden
        draggable={false}
        priority
        className="bullet-sprite-image pointer-events-none h-full w-full max-w-none select-none object-cover object-center"
      />
    </div>
  );
}
