import React, { useEffect, useRef, useState } from "react";

// Remember the two values across home/reader navigation, until this page reloads.
const revealedValues = new Set();
export default function ContactReveal({ text, enabled }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(() => revealedValues.has(text));
  useEffect(() => {
    const reveal = () => {
      revealedValues.add(text);
      setVisible(true);
    };
    if (
      !enabled ||
      revealedValues.has(text) ||
      !("IntersectionObserver" in window)
    ) {
      reveal();
      return;
    }
    let observer;
    const observe = () => {
      observer?.disconnect();
      if (revealedValues.has(text)) return;
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            reveal();
            observer.disconnect();
            window.removeEventListener("resize", observe);
          }
        },
        {
          threshold: 0.15,
          rootMargin: `0px 0px -${Math.round(innerHeight * 0.35)}px 0px`,
        },
      );
      observer.observe(ref.current);
    };
    observe();
    window.addEventListener("resize", observe);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", observe);
    };
  }, [enabled, text]);
  return (
    <strong
      ref={ref}
      className="contact-reveal"
      data-revealed={!enabled || visible}
    >
      {text}
    </strong>
  );
}
