"use client";

import { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", updatePosition, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      id="cursor-crosshair"
      className={`pointer-events-none fixed top-0 left-0 z-[9999] flex h-8 w-8 items-center justify-center mix-blend-difference transition-transform duration-100 ease-out ${isClicking ? "scale-75" : "scale-100"}`}
      style={{
        transform: `translate(${position.x - 16}px, ${position.y - 16}px)`,
      }}
      aria-hidden="true"
    >
      <div className="absolute h-[2px] w-full bg-white opacity-80" />
      <div className="absolute h-full w-[2px] bg-white opacity-80" />
      <div className="absolute h-1 w-1 rounded-full bg-red-500" />
    </div>
  );
}
