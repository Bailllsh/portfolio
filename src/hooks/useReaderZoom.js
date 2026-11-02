import { useRef, useState, useCallback, useEffect } from "react";
import { attachReaderGestures, clampZoom } from "../utils/reader-gestures";

export default function useReaderZoom() {
  const viewport = useRef(null),
    paper = useRef(null),
    scale = useRef(1),
    frame = useRef(0);
  const [zoom, setZoom] = useState(1);
  const getAnchor = useCallback(() => {
    const r = viewport.current.getBoundingClientRect();
    return {
      x: r.left + r.width / 2,
      y: Math.max(100, Math.min(innerHeight / 2, r.bottom - 1)),
    };
  }, []);
  const panBy = useCallback((x, y) => {
    viewport.current.scrollLeft -= x;
    window.scrollBy({ top: -y, behavior: "instant" });
  }, []);
  const zoomAt = useCallback(
    (value, anchor = getAnchor()) => {
      const next = clampZoom(value),
        old = scale.current,
        node = paper.current,
        host = viewport.current;
      if (!node || !host || Math.abs(next - old) < 0.0001) return;
      const before = node.getBoundingClientRect();
      const local = {
        x: (anchor.x - before.left) / old,
        y: (anchor.y - before.top) / old,
      };
      scale.current = next;
      node.style.width = `${next * 100}%`;
      host.dataset.zoomed = String(next > 1.001);
      const after = node.getBoundingClientRect();
      host.scrollLeft += after.left + local.x * next - anchor.x;
      window.scrollBy({
        top: after.top + local.y * next - anchor.y,
        behavior: "instant",
      });
      if (!frame.current)
        frame.current = requestAnimationFrame(() => {
          setZoom(scale.current);
          frame.current = 0;
        });
    },
    [getAnchor],
  );
  useEffect(() => {
    const cleanup = attachReaderGestures(viewport.current, {
      getScale: () => scale.current,
      zoomAt,
      panBy,
      getAnchor,
    });
    const observer = new ResizeObserver(() => {
      if (scale.current === 1) viewport.current.scrollLeft = 0;
    });
    observer.observe(viewport.current);
    return () => {
      cleanup();
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [zoomAt, panBy, getAnchor]);
  return { viewport, paper, zoom, zoomAt, getScale: () => scale.current };
}
