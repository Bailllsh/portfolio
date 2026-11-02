import test from "node:test";
import assert from "node:assert/strict";
import {
  attachReaderGestures,
  clampZoom,
} from "../src/utils/reader-gestures.js";
class Surface extends EventTarget {
  dataset = {};
  setPointerCapture(id) {
    this.captured = id;
  }
}
function setup(start = 1) {
  const surface = new Surface(),
    page = new EventTarget();
  let scale = start;
  const zooms = [],
    pans = [];
  const cleanup = attachReaderGestures(surface, {
    getScale: () => scale,
    zoomAt: (next, point) => {
      scale = clampZoom(next);
      zooms.push({ scale, point });
    },
    panBy: (...point) => pans.push(point),
    getAnchor: () => ({ x: 500, y: 300 }),
  });
  const fire = (type, values = {}, target = surface) => {
    const event = new Event(type, { cancelable: true });
    for (const [key, value] of Object.entries(values))
      Object.defineProperty(event, key, { value });
    target.dispatchEvent(event);
    return event;
  };
  return { surface, page, zooms, pans, fire, cleanup, getScale: () => scale };
}
test("normal reading and browser zoom outside the surface stay native", () => {
  const c = setup();
  assert.equal(
    c.fire("wheel", { deltaX: 0, deltaY: 60 }).defaultPrevented,
    false,
  );
  assert.equal(
    c.fire("wheel", { ctrlKey: true, deltaY: -100 }, c.page).defaultPrevented,
    false,
  );
  assert.equal(
    c.fire("touchstart", { touches: [{ clientX: 10, clientY: 20 }] })
      .defaultPrevented,
    false,
  );
  assert.equal(c.zooms.length, 0);
  c.cleanup();
});
test("trackpad pinch scales locally and consumes the gesture even at a limit", () => {
  const c = setup();
  assert.equal(
    c.fire("wheel", { ctrlKey: true, deltaY: -50, clientX: 100, clientY: 200 })
      .defaultPrevented,
    true,
  );
  assert.ok(c.getScale() > 1);
  assert.deepEqual(c.zooms[0].point, { x: 100, y: 200 });
  c.fire("wheel", { ctrlKey: true, deltaY: 10000 });
  assert.equal(c.getScale(), 0.5);
  assert.equal(
    c.fire("wheel", { ctrlKey: true, deltaY: 10000 }).defaultPrevented,
    true,
  );
  c.fire("wheel", { ctrlKey: true, deltaY: -10000 });
  assert.equal(c.getScale(), 3);
  c.cleanup();
});
test("Safari gesture scale is relative to gesture start and is not double-counted", () => {
  const c = setup(1.5);
  assert.equal(
    c.fire("gesturestart", { clientX: 200, clientY: 250 }).defaultPrevented,
    true,
  );
  c.fire("gesturechange", { scale: 1.5 });
  assert.equal(c.getScale(), 2.25);
  c.fire("gesturechange", { scale: 1.2 });
  assert.ok(Math.abs(c.getScale() - 1.8) < 1e-10);
  const count = c.zooms.length;
  assert.equal(
    c.fire("wheel", { ctrlKey: true, deltaY: -10 }).defaultPrevented,
    true,
  );
  assert.equal(c.zooms.length, count);
  assert.equal(c.fire("gestureend").defaultPrevented, true);
  c.fire("wheel", { ctrlKey: true, deltaY: -10 });
  assert.ok(c.getScale() > 1.8);
  c.cleanup();
});
test("two-finger touch combines scaling and pan; Safari duplicate events are ignored", () => {
  const c = setup();
  c.fire("touchstart", {
    touches: [
      { clientX: 100, clientY: 100 },
      { clientX: 200, clientY: 100 },
    ],
  });
  const move = c.fire("touchmove", {
    touches: [
      { clientX: 80, clientY: 110 },
      { clientX: 230, clientY: 110 },
    ],
  });
  assert.equal(move.defaultPrevented, true);
  assert.equal(c.getScale(), 1.5);
  assert.deepEqual(c.pans[0], [5, 10]);
  c.fire("gesturestart");
  c.fire("gesturechange", { scale: 2 });
  assert.equal(c.getScale(), 1.5);
  c.fire("touchend", { touches: [] });
  c.cleanup();
});
test("zoomed artwork can pan horizontally and drag; cleanup removes ownership", () => {
  const c = setup(2);
  assert.equal(
    c.fire("wheel", { deltaX: 40, deltaY: 2 }).defaultPrevented,
    true,
  );
  assert.deepEqual(c.pans[0], [-40, -2]);
  c.fire("pointerdown", {
    pointerType: "mouse",
    button: 0,
    pointerId: 7,
    clientX: 200,
    clientY: 300,
  });
  c.fire("pointermove", { clientX: 170, clientY: 280 });
  assert.deepEqual(c.pans[1], [-30, -20]);
  assert.equal(c.surface.captured, 7);
  c.fire("pointerup");
  assert.equal(c.surface.dataset.dragging, "false");
  c.cleanup();
  const count = c.zooms.length;
  assert.equal(
    c.fire("wheel", { ctrlKey: true, deltaY: -100 }).defaultPrevented,
    false,
  );
  assert.equal(c.zooms.length, count);
});
