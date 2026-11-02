// Gesture ownership is local to the artwork viewport; browser zoom elsewhere stays native.
export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 3;
export const clampZoom = (value) =>
  Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
export const wheelZoom = (scale, delta, mode = 0) =>
  clampZoom(scale * Math.exp(-delta * (mode === 1 ? 16 : 1) * 0.008));
const midpoint = (touches) => ({
  x: (touches[0].clientX + touches[1].clientX) / 2,
  y: (touches[0].clientY + touches[1].clientY) / 2,
});
const distance = (touches) =>
  Math.hypot(
    touches[1].clientX - touches[0].clientX,
    touches[1].clientY - touches[0].clientY,
  );

export function attachReaderGestures(
  element,
  { getScale, zoomAt, panBy, getAnchor },
) {
  let gesture = null,
    touch = null,
    drag = null,
    lastPoint = null;
  const controller = new AbortController();
  const on = (type, fn, options = {}) =>
    element.addEventListener(type, fn, {
      ...options,
      signal: controller.signal,
    });
  const cancel = (e) => {
    if (e.cancelable) e.preventDefault();
  };
  const point = (e) =>
    Number.isFinite(e.clientX) &&
    Number.isFinite(e.clientY) &&
    (e.clientX || e.clientY)
      ? { x: e.clientX, y: e.clientY }
      : lastPoint || getAnchor();
  on(
    "wheel",
    (e) => {
      if (e.ctrlKey) {
        cancel(e);
        if (!gesture && !touch)
          zoomAt(wheelZoom(getScale(), e.deltaY, e.deltaMode), point(e));
      } else if (getScale() > 1 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        cancel(e);
        panBy(-e.deltaX, -e.deltaY);
      }
    },
    { passive: false },
  );
  on(
    "gesturestart",
    (e) => {
      cancel(e);
      gesture = { scale: getScale(), anchor: point(e) };
    },
    { passive: false },
  );
  on(
    "gesturechange",
    (e) => {
      cancel(e);
      if (gesture && !touch && Number.isFinite(e.scale))
        zoomAt(gesture.scale * e.scale, gesture.anchor);
    },
    { passive: false },
  );
  on(
    "gestureend",
    (e) => {
      cancel(e);
      gesture = null;
    },
    { passive: false },
  );
  on(
    "touchstart",
    (e) => {
      if (e.touches.length >= 2) {
        cancel(e);
        touch = {
          scale: getScale(),
          distance: Math.max(1, distance(e.touches)),
          center: midpoint(e.touches),
        };
      } else if (e.touches.length === 1 && getScale() > 1) {
        cancel(e);
        touch = {
          single: true,
          center: { x: e.touches[0].clientX, y: e.touches[0].clientY },
        };
      }
    },
    { passive: false },
  );
  on(
    "touchmove",
    (e) => {
      if (e.touches.length >= 2 && touch && !touch.single) {
        cancel(e);
        const next = midpoint(e.touches);
        zoomAt(
          (touch.scale * distance(e.touches)) / touch.distance,
          touch.center,
        );
        panBy(next.x - touch.center.x, next.y - touch.center.y);
        touch.center = next;
      } else if (e.touches.length === 1 && touch?.single) {
        cancel(e);
        const next = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        panBy(next.x - touch.center.x, next.y - touch.center.y);
        touch.center = next;
      }
    },
    { passive: false },
  );
  const endTouch = (e) => {
    if (touch) cancel(e);
    touch = null;
  };
  on("touchend", endTouch, { passive: false });
  on("touchcancel", endTouch, { passive: false });
  on("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || getScale() <= 1) return;
    cancel(e);
    drag = point(e);
    element.setPointerCapture(e.pointerId);
    element.dataset.dragging = "true";
  });
  on("pointermove", (e) => {
    lastPoint = point(e);
    if (!drag) return;
    panBy(lastPoint.x - drag.x, lastPoint.y - drag.y);
    drag = lastPoint;
  });
  const endDrag = () => {
    drag = null;
    element.dataset.dragging = "false";
  };
  on("pointerup", endDrag);
  on("pointercancel", endDrag);
  on("lostpointercapture", endDrag);
  return () => {
    controller.abort();
    element.dataset.dragging = "false";
  };
}
