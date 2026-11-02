import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { profile, projects } from "./data";
import { content, projectCopy } from "./content";
import documents from "./case-pages.json";
import { asset } from "./utils/assets";
import ScrollReveal from "./components/ScrollReveal";
import ContactReveal from "./components/ContactReveal";
import PointerEffects from "./components/PointerEffects";
import Wordmark from "./components/Wordmark";
import ProjectReader from "./components/ProjectReader";
import "./styles.css";
import "./reader-and-surfaces.css";
const Arrow = () => <span aria-hidden="true">↗</span>;
const readStorage = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* preferences are optional */
  }
};
const readRoute = () =>
  location.hash.match(/^#project\/(live|mall)$/)?.[1] || null;
const initialLanguage = () => {
  const query = new URLSearchParams(location.search).get("lang");
  return ["zh", "en"].includes(query)
    ? query
    : readStorage("portfolio-language") === "en"
      ? "en"
      : "zh";
};

function ExperienceGroup({ title, items }) {
  return (
    <div className="experience-group">
      <h3>
        {title}
        <span>0{items.length}</span>
      </h3>
      {items.map((item) => (
        <details className="experience-row" key={item.title}>
          <summary>
            <span className="experience-date">{item.date}</span>
            <span className="experience-name">
              {item.title}
              <small>{item.role}</small>
            </span>
            <span className="expand-icon" aria-hidden="true">
              +
            </span>
          </summary>
          <ul>
            {item.bullets.map((text, index) => (
              <li key={index}>{text}</li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
// One shared heading keeps all five sections on the same bilingual baseline.
function SectionHeading({ english, chinese, count }) {
  return (
    <h2 className="section-heading">
      <span lang="zh-CN">
        {chinese}
        {count && <small>({count})</small>}
      </span>
      <span lang="en">{english}</span>
    </h2>
  );
}
function WorkIndex({ motion, items, onOpen, t }) {
  const [active, setActive] = useState(null);
  const ref = useRef(null);
  const move = (e) => {
    if (!motion || e.pointerType === "touch") return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty(
      "--preview-x",
      `${Math.min(r.width - 230, Math.max(240, e.clientX - r.left))}px`,
    );
    ref.current.style.setProperty("--preview-y", `${e.clientY - r.top}px`);
  };
  return (
    <div
      className="work-index"
      ref={ref}
      onPointerMove={move}
      onPointerLeave={() => setActive(null)}
    >
      <SectionHeading english="Work" chinese="作品" count="02" />
      {items.map((p) => (
        <a
          className="work-index-row"
          href={`#project/${p.id}`}
          key={p.id}
          onClick={(e) => onOpen(e, p.id, e.currentTarget)}
          onPointerEnter={() => setActive(p)}
          onFocus={() => setActive(p)}
          onBlur={() => setActive(null)}
        >
          <span className="work-number">{p.number}</span>
          <span className="index-title">{p.title}</span>
          <span className="index-discipline">{p.discipline}</span>
          <Arrow />
        </a>
      ))}
      {active && (
        <div className="floating-preview" aria-hidden="true">
          <img src={asset(active.image)} alt="" />
        </div>
      )}
    </div>
  );
}
function WorkArtwork({ project, onOpen, motion, t }) {
  return (
    <article
      className={`work-artwork artwork-${project.id}`}
      id={project.id}
      data-project={project.id}
    >
      <a
        className="artwork-button"
        href={`#project/${project.id}`}
        data-cursor="view"
        aria-label={`${t.ui.readProject}: ${project.title}`}
        onClick={(e) => onOpen(e, project.id, e.currentTarget)}
        onPointerMove={(e) => {
          if (!motion || e.pointerType === "touch") return;
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty(
            "--image-x",
            `${((e.clientX - r.left) / r.width - 0.5) * 8}px`,
          );
          e.currentTarget.style.setProperty(
            "--image-y",
            `${((e.clientY - r.top) / r.height - 0.5) * 6}px`,
          );
        }}
        onPointerLeave={(e) => {
          e.currentTarget.style.setProperty("--image-x", "0px");
          e.currentTarget.style.setProperty("--image-y", "0px");
        }}
      >
        <img
          src={asset(project.image)}
          width={project.width}
          height={project.height}
          alt={`${project.subtitle} · ${project.title}`}
          loading="lazy"
          decoding="async"
        />
        <span className="artwork-view">
          {t.ui.readProject}
          <Arrow />
        </span>
      </a>
      <div className="artwork-caption">
        <div>
          <span>
            {project.number} / {project.subtitle}
          </span>
          <h3>{project.title}</h3>
        </div>
        <span>{project.discipline}</span>
        <p>{project.summary}</p>
      </div>
    </article>
  );
}
function Awards({ t }) {
  const [expanded, setExpanded] = useState(false);
  const groups = expanded ? t.awards.groups : t.awards.groups.slice(0, 2);
  return (
    <section className="awards-section" id="awards">
      <SectionHeading english="Honors & Awards" chinese="荣誉与奖项" />
      <div className="awards-grid" id="award-groups">
        {groups.map((group, index) => (
          <div
            className={`award-group ${index === 0 ? "provincial" : ""}`}
            key={group.title}
          >
            <h3>{group.title}</h3>
            {group.items.map((item) => (
              <div className="award-row" key={`${item.name}-${item.date}`}>
                <span>{item.name}</span>
                <time>{item.date}</time>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button
        className="awards-toggle"
        aria-expanded={expanded}
        aria-controls="award-groups"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? t.ui.awardsLess : t.ui.awardsMore}
        <span>{expanded ? "−" : "+"}</span>
      </button>
    </section>
  );
}
function App() {
  const [lang, setLang] = useState(initialLanguage),
    [route, setRoute] = useState(readRoute);
  useEffect(() => {
    document.documentElement.dataset.surface = "glass";
  }, []);
  const [motion, setMotion] = useState(() =>
      readStorage("portfolio-motion") === "off"
        ? false
        : !matchMedia("(prefers-reduced-motion:reduce)").matches,
    ),
    [toast, setToast] = useState("");
  const homeY = useRef(0),
    routeRef = useRef(route),
    returnFocus = useRef(null),
    copyTimer = useRef(null),
    navigationBusy = useRef(false);
  const t = content[lang],
    items = projects.map((p) => ({
      ...p,
      ...projectCopy[p.id][lang],
      image: documents[p.id].pages[0].src,
      width: documents[p.id].pages[0].width,
      height: documents[p.id].pages[0].height,
    }));
  const project = items.find((p) => p.id === route);
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  useEffect(() => {
    document.documentElement.classList.toggle("motion-off", !motion);
    writeStorage("portfolio-motion", motion ? "on" : "off");
    return () => document.documentElement.classList.remove("motion-off");
  }, [motion]);
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    writeStorage("portfolio-language", lang);
    document.title = route
      ? `${projectCopy[route][lang].title} — Bai Luping`
      : "Bai Luping — Design Portfolio";
    document
      .querySelector("meta[name=description]")
      ?.setAttribute("content", t.ui.siteDescription);
  }, [lang, route]);
  useEffect(() => {
    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";
    const sync = () => {
      const next = readRoute();
      if (!routeRef.current && next) homeY.current = window.scrollY;
      setRoute(next);
    };
    addEventListener("popstate", sync);
    addEventListener("hashchange", sync);
    return () => {
      removeEventListener("popstate", sync);
      removeEventListener("hashchange", sync);
      history.scrollRestoration = previous;
    };
  }, []);
  useLayoutEffect(() => {
    if (route) window.scrollTo({ top: 0, behavior: "instant" });
    else if (routeRef.current) {
      window.scrollTo({ top: homeY.current, behavior: "instant" });
      document
        .querySelector(returnFocus.current || ".name-link")
        ?.focus({ preventScroll: true });
    }
    routeRef.current = route;
  }, [route]);
  const changeLanguage = (value) => {
    setLang(value);
    const url = new URL(location.href);
    url.searchParams.set("lang", value);
    history.replaceState(history.state, "", url);
  };
  const openProject = (e, id, element) => {
    if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) return;
    e?.preventDefault();
    if (navigationBusy.current) return;
    if (!route) {
      homeY.current = window.scrollY;
      returnFocus.current = element?.classList.contains("work-index-row")
        ? `.work-index-row[href="#project/${id}"]`
        : `#${id} .artwork-button`;
    }
    const image = element?.querySelector("img");
    if (image) image.style.viewTransitionName = `artwork-${id}`;
    const update = () => {
      history.pushState({ portfolio: true }, "", `#project/${id}`);
      flushSync(() => {
        setRoute(id);
      });
    };
    if (document.startViewTransition && motion) {
      navigationBusy.current = true;
      const vt = document.startViewTransition(update);
      vt.finished
        .catch(() => {})
        .finally(() => {
          navigationBusy.current = false;
          if (image) image.style.viewTransitionName = "";
        });
    } else {
      update();
      if (image) image.style.viewTransitionName = "";
    }
  };
  const goHome = (target = "#work", restore = false) => {
    if (navigationBusy.current) return;
    const id = route;
    const cover = document.querySelector('.continuous-page[data-page="1"] img');
    // A deeply scrolled reader returns from the visible artwork, rather than
    // jumping to page one just to animate. List entries use a simple page fade.
    const visibleImage = [...document.querySelectorAll(".continuous-page img")]
      .map((image) => {
        const r = image.getBoundingClientRect();
        return {
          image,
          visible: Math.max(
            0,
            Math.min(innerHeight, r.bottom) - Math.max(0, r.top),
          ),
        };
      })
      .sort((a, b) => b.visible - a.visible)[0];
    const source =
      restore && visibleImage?.visible > 0 ? visibleImage.image : null;
    if (cover) cover.style.viewTransitionName = "none";
    if (source) source.style.viewTransitionName = `artwork-${id}`;
    let destination;
    const update = () => {
      history.pushState({}, "", target);
      flushSync(() => setRoute(null));
      if (!restore || !homeY.current)
        document
          .getElementById(target.slice(1))
          ?.scrollIntoView({ behavior: "instant", block: "start" });
      destination =
        returnFocus.current &&
        document.querySelector(returnFocus.current)?.querySelector("img");
      if (source && destination)
        destination.style.viewTransitionName = `artwork-${id}`;
    };
    if (document.startViewTransition && motion) {
      navigationBusy.current = true;
      const vt = document.startViewTransition(update);
      vt.finished
        .catch(() => {})
        .finally(() => {
          navigationBusy.current = false;
          if (destination) destination.style.viewTransitionName = "";
        });
    } else {
      update();
      if (destination) destination.style.viewTransitionName = "";
    }
  };
  const navClick = (e, target) => {
    if (route && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      goHome(target);
    }
  };
  const copy = async (value, label) => {
    clearTimeout(copyTimer.current);
    try {
      await navigator.clipboard.writeText(value);
      setToast(label);
    } catch {
      setToast(`${t.contact.copyFailed}: ${value}`);
    }
    copyTimer.current = setTimeout(() => setToast(""), 3500);
  };
  const header = (
    <header className="site-header">
      <a className="name-link" href="#top" onClick={(e) => navClick(e, "#top")}>
        <span lang="zh-CN">{profile.name}</span>
        <span lang="en">BAI LUPING</span>
      </a>
      <nav aria-label={lang === "zh" ? "主导航" : "Main navigation"}>
        <a href="#work" onClick={(e) => navClick(e, "#work")}>
          {t.nav.work}
        </a>
        <a href="#about" onClick={(e) => navClick(e, "#about")}>
          {t.nav.about}
        </a>
        <a href="#contact" onClick={(e) => navClick(e, "#contact")}>
          {t.nav.contact}
        </a>
        <a
          className="nav-resume"
          href={asset("downloads/bai-luping-resume-zh.pdf")}
          download="Bai-Luping-Resume-ZH.pdf"
        >
          {t.nav.resume}
        </a>
      </nav>
      <div className="header-settings">
        <div
          className="language-switch"
          role="group"
          aria-label={t.nav.language}
          data-active={lang}
        >
          <span className="language-thumb" aria-hidden="true" />
          <button
            lang="zh-CN"
            aria-pressed={lang === "zh"}
            onClick={() => changeLanguage("zh")}
          >
            简体中文
          </button>
          <button
            lang="en"
            aria-pressed={lang === "en"}
            onClick={() => changeLanguage("en")}
          >
            EN
          </button>
          <span className="language-selected-ink" aria-hidden="true">
            <span>简体中文</span>
            <span>EN</span>
          </span>
        </div>
        <button
          className="motion-toggle"
          aria-pressed={motion}
          onClick={() => setMotion(!motion)}
          aria-label={`${t.nav.motion} ${motion ? t.nav.on : t.nav.off}`}
        >
          <span className="motion-word">
            {t.nav.motion} {motion ? t.nav.on : t.nav.off}
          </span>
          <span aria-hidden="true">{motion ? "◉" : "○"}</span>
        </button>
      </div>
    </header>
  );
  return (
    <div
      className={`portfolio-site locale-${lang} ${route ? "is-reading" : ""}`}
      id="top"
      data-surface="glass"
    >
      <a
        className="skip-link"
        href={route ? "#project-top" : "#work"}
        onClick={(e) => {
          if (route) {
            e.preventDefault();
            document
              .getElementById("project-top")
              ?.scrollIntoView({ behavior: "instant" });
          }
        }}
      >
        {t.ui.skip}
      </a>
      {!route ? (
        <>
          <div className="first-screen">
            {header}
            <section className="hero" aria-labelledby="hero-title">
              <div className="hero-top">
                <div>
                  <h1 id="hero-title">{t.hero.discipline}</h1>
                </div>
                <p>
                  {t.hero.education[0]}
                  <br />
                  {t.hero.education[1]}
                </p>
              </div>
              <div className="hero-space" aria-hidden="true" />
              <div className="hero-byline">
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
                <button
                  data-cursor="copy"
                  onClick={() => copy(profile.wechat, t.contact.copiedWechat)}
                >
                  {profile.wechat}
                </button>
              </div>
              <Wordmark
                motion={motion}
                label={
                  lang === "zh"
                    ? "点击 Portfolio 标题"
                    : "Press the Portfolio title"
                }
              />
            </section>
          </div>
          <main>
            <section
              className="work-section"
              id="work"
              aria-label={t.ui.workLabel}
            >
              <WorkIndex
                motion={motion}
                items={items}
                onOpen={openProject}
                t={t}
              />
              {items.map((p) => (
                <WorkArtwork
                  key={p.id}
                  project={p}
                  onOpen={openProject}
                  motion={motion}
                  t={t}
                />
              ))}
            </section>
            <section className="about-section" id="about">
              <SectionHeading english="About" chinese="关于" />
              <div className="about-main">
                <ScrollReveal
                  text={t.about.title}
                  as="p"
                  className="about-title"
                  enabled={motion}
                />
                <div className="profile-intro">
                  {t.about.intro.slice(0, 2).map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <p className="upcoming-note">
                  <span className="upcoming-dot" />
                  {t.ui.upcoming}
                </p>
                <div className="profile-tags">
                  {t.about.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <a
                  className="resume-link"
                  href={asset("downloads/bai-luping-resume-zh.pdf")}
                  download="Bai-Luping-Resume-ZH.pdf"
                >
                  {t.ui.resumeDownload}
                  {lang === "en" ? " · 中文 PDF" : ""}
                  <Arrow />
                </a>
              </div>
              <div className="education-list">
                {t.about.education.map((edu) => (
                  <div key={edu.school}>
                    <h3>{edu.school}</h3>
                    <span>{edu.course}</span>
                    <time>{edu.date}</time>
                    <p>{edu.detail}</p>
                  </div>
                ))}
              </div>
            </section>
            <Awards t={t} />
            <section className="experience-section" id="experience">
              <SectionHeading english="Experience" chinese="经历" />
              <p className="experience-meta">
                <ScrollReveal
                  as="strong"
                  text={t.experience.company}
                  enabled={motion}
                  subtle
                />
                <span>
                  {t.experience.role} / {t.experience.date}
                </span>
              </p>
              <ExperienceGroup
                title={t.experience.internshipLabel}
                items={t.experience.internships}
              />
              <ExperienceGroup
                title={t.experience.campusLabel}
                items={t.experience.campus}
              />
            </section>
            <section className="contact-section" id="contact">
              <SectionHeading english="Contact" chinese="联系" />
              <div className="contact-links">
                <button
                  data-cursor="copy"
                  onClick={() => copy(profile.email, t.contact.copiedEmail)}
                >
                  <span>{t.contact.emailLabel}</span>
                  <ContactReveal text={profile.email} enabled={motion} />
                  <Arrow />
                </button>
                <button
                  data-cursor="copy"
                  onClick={() => copy(profile.wechat, t.contact.copiedWechat)}
                >
                  <span>{t.contact.wechatLabel}</span>
                  <ContactReveal text={profile.wechat} enabled={motion} />
                  <Arrow />
                </button>
              </div>
              <div className="contact-actions">
                <a href={`mailto:${profile.email}`}>
                  {t.contact.writeEmail}
                  <Arrow />
                </a>
                <a
                  href={asset("downloads/bai-luping-resume-zh.pdf")}
                  download="Bai-Luping-Resume-ZH.pdf"
                >
                  {t.ui.resumeDownload}
                  <Arrow />
                </a>
              </div>
              <footer role="contentinfo">
                <div className="footer-byline">
                  <span>{profile.name} / BAI LUPING</span>
                  <span>UI / UX / VISUAL / AIGC</span>
                  <a href="#top">{t.contact.backTop} ↑</a>
                </div>
                <Wordmark footer motion={motion} label={t.contact.backTop} />
                <div className="footer-bottom">
                  <span>© {new Date().getFullYear()} Bai Luping</span>
                  <a
                    href={asset("fonts/HarmonyOS-Sans-LICENSE.txt")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {lang === "zh" ? "中文字体：" : "Chinese type: "}HarmonyOS
                    Sans
                  </a>
                </div>
              </footer>
            </section>
          </main>
        </>
      ) : (
        <>
          {header}
          <ProjectReader
            key={route}
            project={project}
            copy={projectCopy[route][lang]}
            document={documents[route]}
            t={t.project}
            lang={lang}
            onBack={() => goHome("#work", true)}
            onNext={() =>
              openProject(null, route === "live" ? "mall" : "live", null)
            }
          />
        </>
      )}
      <div
        className="copy-toast"
        role="status"
        aria-live="polite"
        data-visible={!!toast}
      >
        {toast}
      </div>
      <PointerEffects enabled={motion} />
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
