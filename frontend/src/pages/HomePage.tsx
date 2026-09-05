import { useEffect } from "react";
import { apiUrl } from "../api";
import { Layout } from "../components/Layout";

const projects = [
  {
    number: "01",
    title: "Minesweeper",
    description: "The classic game. Dig carefully and keep an eye on the corners.",
    href: "/pages/minesweeper/minesweeper.html",
    tag: "Playable",
  },
  {
    number: "02",
    title: "Poleand",
    description: "A polarity-based atomic defense game built with friends in Godot.",
    href: "/pages/poleand_game.html",
    tag: "Godot game",
  },
  {
    number: "03",
    title: "MAO News",
    description: "Announcements, events, and bulletins from the MAO News Desk.",
    href: "/pages/news.html",
    tag: "News desk",
  },
  {
    number: "04",
    title: "Top XKCD",
    description: "A highly subjective and therefore definitive ranking of great comics.",
    href: "/pages/xkcd.html",
    tag: "Comics",
  },
] as const;

export function HomePage() {
  useEffect(() => {
    const controller = new AbortController();
    fetch(apiUrl("/api/ring-buzzer"), { method: "POST", signal: controller.signal }).catch((error: unknown) => {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.warn("The physical visitor buzzer is unavailable", error);
      }
    });
    return () => controller.abort();
  }, []);

  return (
    <Layout wide>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Personal site · experiments · questionable ideas</p>
          <h1>Small projects with<br /><span>unnecessarily big energy.</span></h1>
          <p className="hero-intro">
            I’m Olgierd. This is the place where I publish games, server experiments,
            field notes, and whatever else survives long enough to get a URL.
          </p>
          <div className="hero-actions">
            <a className="button" href="#projects">See the projects</a>
            <a className="text-link" href="/pages/blog-files/post-2/post-2.html">Read the latest complete note →</a>
          </div>
        </div>
        <div className="hero-orbit" aria-label="Site status">
          <div className="orbit-ring"><span>DW</span></div>
          <p><strong>Self-hosted.</strong><br />Built for curiosity,<br />not conversion.</p>
        </div>
      </section>

      <section id="projects" className="section-block">
        <div className="section-heading">
          <div><p className="eyebrow">Things that work</p><h2>Selected projects</h2></div>
          <p>A mix of browser games, live services, and ideas that escaped the notebook.</p>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <a className="project-card" href={project.href} key={project.href}>
              <div className="project-meta"><span>{project.number}</span><span>{project.tag}</span></div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <span className="card-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="split-feature">
        <div>
          <p className="eyebrow">Behind the rack</p>
          <h2>A website with a pulse.</h2>
        </div>
        <div>
          <p>Opening this homepage rings a real physical buzzer somewhere in my house. A tiny machine has already announced your arrival.</p>
          <p>The rest of the place is games, strange experiments, friends, and notes from whichever rabbit hole looked most interesting that week.</p>
        </div>
      </section>
    </Layout>
  );
}
