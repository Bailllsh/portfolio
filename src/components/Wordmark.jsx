import React, { useRef, useLayoutEffect, useState } from "react";

// Rasterize the same SVG once to measure its ink. Canvas text metrics and SVG
// text layout can disagree in Safari, especially with negative letter spacing.
let inkMeasurement;
function measureInk() {
  if (inkMeasurement) return inkMeasurement;
  inkMeasurement = document.fonts.ready.then(
    () =>
      new Promise((resolve, reject) => {
        const scale = 4;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="480" viewBox="0 0 400 120"><text x="0" y="100" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="100" font-weight="700" letter-spacing="-10">Portfolio</text></svg>`;
        const url = URL.createObjectURL(
          new Blob([svg], { type: "image/svg+xml" }),
        );
        const image = new Image();
        image.onload = () => {
          URL.revokeObjectURL(url);
          try {
            const canvas = document.createElement("canvas");
            canvas.width = 1600;
            canvas.height = 480;
            const context = canvas.getContext("2d", {
              willReadFrequently: true,
            });
            context.drawImage(image, 0, 0);
            const pixels = context.getImageData(
              0,
              0,
              canvas.width,
              canvas.height,
            ).data;
            let left = canvas.width,
              top = canvas.height,
              right = -1,
              bottom = -1;
            for (let y = 0; y < canvas.height; y++) {
              for (let x = 0; x < canvas.width; x++) {
                if (pixels[(y * canvas.width + x) * 4 + 3] === 0) continue;
                left = Math.min(left, x);
                right = Math.max(right, x);
                top = Math.min(top, y);
                bottom = Math.max(bottom, y);
              }
            }
            if (right < left) throw new Error("Empty wordmark");
            resolve(
              `${left / scale} ${top / scale} ${(right - left + 1) / scale} ${(bottom - top + 1) / scale}`,
            );
          } catch (error) {
            reject(error);
          }
        };
        image.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("Wordmark measurement unavailable"));
        };
        image.src = url;
      }),
  );
  return inkMeasurement;
}

export default function Wordmark({ footer = false, motion = true, label }) {
  const text = useRef(null),
    [box, setBox] = useState("0 20 350 82"),
    [pressed, setPressed] = useState(false);
  useLayoutEffect(() => {
    let active = true;
    const fallback = text.current?.getBBox();
    if (fallback?.width)
      setBox(
        `${fallback.x} ${fallback.y} ${fallback.width} ${fallback.height}`,
      );
    measureInk()
      .then((value) => {
        if (active) setBox(value);
      })
      .catch(() => {
        // Keep native SVG bounds if a browser cannot read an SVG into canvas.
      });
    return () => {
      active = false;
    };
  }, []);
  const [, , inkWidth, inkHeight] = box.split(" ").map(Number);
  return (
    <div className={`wordmark-frame ${footer ? "footer-wordmark" : ""}`}>
      <button
        className={`portfolio-wordmark ${pressed ? "is-pressed" : ""}`}
        aria-label={label}
        onClick={() => {
          if (footer)
            window.scrollTo({
              top: 0,
              behavior: motion ? "smooth" : "instant",
            });
          else setPressed(true);
        }}
        onAnimationEnd={() => setPressed(false)}
      >
        <svg
          viewBox={box}
          width={inkWidth}
          height={inkHeight}
          style={{ aspectRatio: `${inkWidth} / ${inkHeight}` }}
          role="presentation"
          aria-hidden="true"
        >
          <text
            ref={text}
            x="0"
            y="100"
            fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif"
            fontSize="100"
            fontWeight="700"
            letterSpacing="-10"
          >
            Portfolio
          </text>
        </svg>
      </button>
    </div>
  );
}
