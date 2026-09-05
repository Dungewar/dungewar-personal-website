import { useState } from "react";
import { Layout } from "../components/Layout";

export function PoleandPage() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Layout wide>
      <section className="page-hero compact">
        <p className="eyebrow">Atomic strategy · Godot</p>
        <h1>Poleand</h1>
        <p>Swap polarity, deploy five specialized units, and stop the atoms from taking over everything.</p>
      </section>
      <section className={expanded ? "game-frame expanded" : "game-frame"}>
        <div className="game-toolbar">
          <span><i className="status-dot" /> Game build</span>
          <button type="button" onClick={() => setExpanded((value) => !value)}>
            {expanded ? "Exit expanded view" : "Expand game"}
          </button>
        </div>
        <iframe title="Poleand game" src="/games/poleand/index.html" allow="autoplay; fullscreen" />
      </section>
      <section className="prose-grid">
        <div><p className="eyebrow">How it works</p><h2>Opposites attract.<br />Then destroy.</h2></div>
        <div>
          <p>You control atomic troops with positive or negative polarity. Opposites attract and damage each other; matching polarities pass harmlessly by. Change your troops at any time as each wave gets harder.</p>
          <p>Created by Olgierd Matusiewicz, Rohan Nadkarni, and Qinzhao Li.</p>
        </div>
      </section>
    </Layout>
  );
}
