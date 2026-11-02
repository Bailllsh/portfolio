import React, { useEffect, useRef } from "react";

export default function PointerEffects({ enabled }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !matchMedia("(hover:hover) and (pointer:fine)").matches) {
      el.dataset.visible = "false";
      return;
    }
    const core = el.querySelector(".pointer-core"),
      halo = el.querySelector(".pointer-halo"),
      shadow = el.querySelector(".pointer-shadow"),
      label = el.querySelector(".pointer-label");
    let target = { x: 0, y: 0 },
      ring = { x: 0, y: 0 },
      trail = { x: 0, y: 0 },
      visible = false,
      frame = 0,
      last = 0;
    const place = (node, p) =>
      (node.style.transform = `translate3d(${p.x}px,${p.y}px,0)`);
    const animate = (now) => {
      const dt = Math.min(32, now - last || 16);
      last = now;
      // Main ring settles quickly; only the subtle shadow retains a short trail.
      const fast = 1 - Math.exp(-dt / 16),
        soft = 1 - Math.exp(-dt / 38);
      ring.x += (target.x - ring.x) * fast;
      ring.y += (target.y - ring.y) * fast;
      trail.x += (target.x - trail.x) * soft;
      trail.y += (target.y - trail.y) * soft;
      place(halo, ring);
      place(shadow, trail);
      const unsettled =
        Math.abs(target.x - trail.x) + Math.abs(target.y - trail.y) > 0.1;
      frame = unsettled ? requestAnimationFrame(animate) : 0;
    };
    const move = (e) => {
      if (e.pointerType === "touch") return;
      if (e.target.closest("[data-reader-surface], [data-native-cursor]")) {
        leave();
        return;
      }
      target = { x: e.clientX, y: e.clientY };
      if (!visible) {
        ring = { ...target };
        trail = { ...target };
        visible = true;
        el.dataset.visible = "true";
        place(halo, ring);
        place(shadow, trail);
      }
      // The actual pointer is updated immediately, with no interpolation.
      place(core, target);
      const clickable = e.target.closest("[data-cursor],a,button,summary");
      const mode =
        clickable?.dataset.cursor || (clickable ? "link" : "default");
      if (el.dataset.mode !== mode) {
        el.dataset.mode = mode;
        label.textContent =
          mode === "view" ? "VIEW ↗" : mode === "copy" ? "COPY" : "";
      }
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(animate);
      }
    };
    const leave = () => {
      visible = false;
      el.dataset.visible = "false";
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const controller = new AbortController(),
      signal = controller.signal;
    document.addEventListener("pointermove", move, { passive: true, signal });
    document.addEventListener("pointerleave", leave, { signal });
    document.addEventListener("pointerdown", () => (el.dataset.down = "true"), {
      signal,
    });
    document.addEventListener("pointerup", () => (el.dataset.down = "false"), {
      signal,
    });
    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) leave();
      },
      { signal },
    );
    return () => {
      controller.abort();
      cancelAnimationFrame(frame);
      el.dataset.visible = "false";
    };
  }, [enabled]);
  return (
    <div
      ref={ref}
      className={`pointer-effects ${enabled ? "" : "disabled"}`}
      aria-hidden="true"
    >
      <div className="pointer-ring pointer-core" />
      <div className="pointer-ring pointer-halo">
        <span className="pointer-label" />
      </div>
      <div className="pointer-ring pointer-shadow" />
    </div>
  );
}
