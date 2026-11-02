import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { asset } from "../utils/assets";
import { readerSections } from "../reader-sections";
import useReaderZoom from "../hooks/useReaderZoom";

export default function ProjectReader({
  project,
  copy,
  document: caseDocument,
  t,
  lang,
  onBack,
  onNext,
}) {
  const [current, setCurrent] = useState(1),
    [tocOpen, setTocOpen] = useState(
      () => matchMedia("(min-width: 1100px)").matches,
    ),
    [inView, setInView] = useState(false);
  const [closeTop, setCloseTop] = useState(104);
  const [highlight, setHighlight] = useState({ top: 0, height: 42 });
  const menu = useRef(null);
  const { viewport, paper, zoom, zoomAt, getScale } = useReaderZoom();
  const sections = readerSections[project.id];
  const active = Math.max(
    0,
    sections.findLastIndex((s) => current >= s.page),
  );
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const r = viewport.current.getBoundingClientRect(),
        anchor = Math.min(innerHeight * 0.3, 180);
      setCloseTop(
        Math.max(
          16,
          (document.querySelector(".site-header")?.getBoundingClientRect()
            .bottom || 0) + 12,
        ),
      );
      setInView(r.top < innerHeight - 100 && r.bottom > 120);
      const pages = [...paper.current.querySelectorAll("[data-page]")];
      let page = 1;
      for (const node of pages) {
        if (node.getBoundingClientRect().top <= anchor)
          page = Number(node.dataset.page);
        else break;
      }
      setCurrent(page);
      frame = 0;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(paper.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [project.id]);
  useLayoutEffect(() => {
    const measure = () => {
      const link = menu.current?.querySelector('[aria-current="location"]');
      if (link)
        setHighlight({ top: link.offsetTop, height: link.offsetHeight });
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (menu.current) observer.observe(menu.current);
    return () => observer.disconnect();
  }, [active, lang, tocOpen]);
  useEffect(() => {
    const escape = (event) => {
      if (event.key !== "Escape" || event.defaultPrevented || event.isComposing)
        return;
      if (
        event.target.closest?.(
          'input, textarea, select, [contenteditable="true"]',
        )
      )
        return;
      event.preventDefault();
      onBack();
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [onBack]);
  const jump = (e, page) => {
    e.preventDefault();
    const desktop = matchMedia("(min-width: 1100px)").matches;
    setTocOpen(desktop);
    if (!desktop) viewport.current.focus({ preventScroll: true });
    setCurrent(page);
    document.getElementById(`case-${page}`)?.scrollIntoView({
      behavior: document.documentElement.classList.contains("motion-off")
        ? "instant"
        : "smooth",
      block: "start",
    });
  };
  const isChinese = lang === "zh";
  return (
    <main className="project-reader continuous-project" id="project-top">
      {["left", "right"].map((side) => (
        <button
          key={side}
          className={`reader-exit-gutter reader-exit-${side}`}
          onClick={onBack}
          tabIndex={-1}
          data-native-cursor
          aria-label={
            isChinese
              ? `点击${side === "left" ? "左" : "右"}侧空白返回作品`
              : `Return to work from the ${side} margin`
          }
          title={
            isChinese
              ? "点击空白返回作品 · Esc"
              : "Click outside to return · Esc"
          }
        />
      ))}
      <button
        className="reader-close"
        style={{ top: closeTop }}
        onClick={onBack}
        aria-label={isChinese ? "关闭作品预览" : "Close project preview"}
        title={isChinese ? "关闭作品预览 · Esc" : "Close project preview · Esc"}
      >
        <span className="reader-close-label">
          {isChinese ? "关闭" : "Close"}
        </span>
        <kbd>Esc</kbd>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m7 7 10 10M17 7 7 17" />
        </svg>
      </button>
      <div className="reader-intro">
        <div className="reader-topbar">
          <button onClick={onBack}>{t.back}</button>
          <span>{copy.discipline}</span>
        </div>
        <div className="reader-heading">
          <span className="reader-client">{copy.subtitle}</span>
          <h1>{copy.title}</h1>
          <p>{copy.summary}</p>
        </div>
        <details className="reader-brief">
          <summary>
            {t.overview}
            <span aria-hidden="true">+</span>
          </summary>
          <div className="project-overview">
            {[
              ["background", copy.background],
              ["role", copy.role],
              ["process", copy.approach],
              ["outcome", copy.outcome],
            ].map(([key, value]) => (
              <div key={key}>
                <h2>{t[key]}</h2>
                <p>{value}</p>
              </div>
            ))}
          </div>
        </details>
        {lang === "en" && (
          <p className="artwork-language-note">{t.englishArtworkNote}</p>
        )}
      </div>
      <div className="continuous-stage">
        <aside
          className={`chapter-dock ${tocOpen ? "is-open" : ""}`}
          data-visible={inView}
          aria-label={t.contents}
        >
          <button
            className="chapter-toggle"
            aria-expanded={tocOpen}
            aria-controls="chapter-links"
            aria-label={`${t.contents} ${current} / ${caseDocument.pageCount}`}
            onClick={() => setTocOpen(!tocOpen)}
          >
            <svg
              className="reading-ring"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="12" />
              <circle
                cx="16"
                cy="16"
                r="12"
                pathLength="100"
                strokeDasharray={`${(current / caseDocument.pageCount) * 100} 100`}
              />
            </svg>
            <span>
              {t.contents}
              <small>
                {current} / {caseDocument.pageCount}
              </small>
            </span>
            <span className="chapter-chevron" aria-hidden="true">
              ⌃
            </span>
          </button>
          <nav
            id="chapter-links"
            className="chapter-links"
            ref={menu}
            aria-label={t.contents}
          >
            <span
              className="chapter-highlight"
              style={{ top: highlight.top, height: highlight.height }}
              aria-hidden="true"
            />
            {sections.map((s, index) => (
              <a
                key={s.page}
                href={`#case-${s.page}`}
                aria-current={index === active ? "location" : undefined}
                onClick={(e) => jump(e, s.page)}
              >
                <span className="chapter-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{s.title[lang]}</span>
              </a>
            ))}
          </nav>
        </aside>
        <div
          className="reader-viewport"
          ref={viewport}
          data-reader-surface
          data-zoomed="false"
          tabIndex="0"
          role="region"
          aria-label={
            isChinese
              ? "作品连续阅读画布，可双指缩放"
              : "Continuous artwork reader. Pinch to zoom."
          }
          onKeyDown={(e) => {
            if (e.key === "+" || e.key === "=") {
              e.preventDefault();
              zoomAt(getScale() * 1.2);
            }
            if (e.key === "-") {
              e.preventDefault();
              zoomAt(getScale() / 1.2);
            }
            if (e.key === "0") {
              e.preventDefault();
              zoomAt(1);
            }
          }}
        >
          <div className="reader-paper" ref={paper}>
            {caseDocument.pages.map((page, index) => (
              <section
                className="continuous-page"
                id={`case-${page.page}`}
                data-page={page.page}
                key={page.id}
                aria-label={`${page.page}. ${page.title[lang]}`}
              >
                <img
                  src={asset(page.src)}
                  width={page.width}
                  height={page.height}
                  alt={`${copy.title} · ${page.title[lang]}`}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  draggable="false"
                  style={
                    index === 0
                      ? { viewTransitionName: `artwork-${project.id}` }
                      : undefined
                  }
                />
              </section>
            ))}
          </div>
        </div>
        <div
          className="reader-tools"
          data-visible={inView}
          role="group"
          aria-label={isChinese ? "作品缩放" : "Artwork zoom"}
        >
          <span className="reader-gesture-hint">
            {isChinese ? "双指缩放" : "Pinch to zoom"}
          </span>
          <button
            onClick={() => zoomAt(getScale() / 1.2)}
            disabled={zoom <= 0.501}
            aria-label={isChinese ? "缩小作品" : "Zoom out artwork"}
          >
            −
          </button>
          <output aria-live="off">{Math.round(zoom * 100)}%</output>
          <button
            onClick={() => zoomAt(getScale() * 1.2)}
            disabled={zoom >= 2.999}
            aria-label={isChinese ? "放大作品" : "Zoom in artwork"}
          >
            +
          </button>
          <span className="reader-tools-divider" />
          <button className="reader-fit" onClick={() => zoomAt(1)}>
            {isChinese ? "适合宽度" : "Fit width"}
          </button>
        </div>
      </div>
      <div className="reader-end">
        <button onClick={onBack}>{t.back}</button>
        <button onClick={onNext}>
          {isChinese ? "下一个项目" : "Next project"}
        </button>
      </div>
    </main>
  );
}
