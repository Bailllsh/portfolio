import React, { useEffect, useRef } from "react";

// 用滚动位置逐字计算清晰度，不依赖固定延时；反向滚动也能自然回退。
export default function ScrollReveal({
  text,
  as: Tag = "h2",
  className = "",
  enabled = true,
  subtle = false,
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (!enabled) return;
    const element = ref.current;
    const letters = [...element.querySelectorAll(".reveal-char")];
    const travel = subtle ? 0.18 : 0.55;
    const maxBlur = subtle ? 3 : 9;
    const minOpacity = subtle ? 0.45 : 0.16;
    const lift = subtle ? 2 : 8;
    let frame = 0;
    const update = () => {
      const rect = element.getBoundingClientRect();
      // Company-name ink starts resolving only after its center crosses mid-screen.
      const position = subtle ? rect.top + rect.height / 2 : rect.top;
      const start = subtle ? 0.5 : 0.95;
      const progress = Math.min(
        1,
        Math.max(0, (innerHeight * start - position) / (innerHeight * travel)),
      );
      letters.forEach((letter, index) => {
        const point = (index / Math.max(1, letters.length - 1)) * 0.62;
        const visible = Math.max(0, Math.min(1, (progress - point) / 0.38));
        letter.style.opacity = minOpacity + visible * (1 - minOpacity);
        letter.style.filter = `blur(${(1 - visible) * maxBlur}px)`;
        letter.style.transform = `translateY(${(1 - visible) * lift}px)`;
      });
      frame = 0;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, [enabled, text, subtle]);
  return (
    <Tag ref={ref} className={`scroll-reveal ${className}`} aria-label={text}>
      {[...text].map((letter, index) => (
        <span
          key={index}
          aria-hidden="true"
          className="reveal-char"
          style={
            !enabled
              ? { opacity: 1, filter: "none", transform: "none" }
              : undefined
          }
        >
          {letter === " " ? "\u00a0" : letter}
        </span>
      ))}
    </Tag>
  );
}
