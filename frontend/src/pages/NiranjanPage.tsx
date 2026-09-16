import { type CSSProperties, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { Definition, getDefinition } from "../offlineDictionary";
import "./NiranjanPage.css";

// This also drives the hover-progress animation through --nir-hover-delay below.
const HOVER_OPEN_DELAY_MS = 10;

function DefinitionWord({ word, depth, trailing }: { word: string; depth: number; trailing?: ReactNode }) {
  const [definition, setDefinition] = useState<Definition | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();
  const clearHoverTimer = () => {
    if (hoverTimer.current !== null) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  };
  const open = () => {
    clearHoverTimer();
    if (definition) return;
    setDefinition({ meaning: "Meaning requested. The proof of the meaning is pending.", source: "pending" });
    void getDefinition(word).then(setDefinition);
  };
  const startHoverTimer = () => {
    if (definition || hoverTimer.current !== null) return;
    hoverTimer.current = setTimeout(open, HOVER_OPEN_DELAY_MS);
  };
  useEffect(() => () => {
    if (hoverTimer.current !== null) clearTimeout(hoverTimer.current);
  }, []);

  return (
    <span className={definition ? "nir-word nir-word-open" : "nir-word"}>
      <button
        type="button"
        aria-expanded={Boolean(definition)}
        aria-controls={id}
        onClick={open}
        onMouseEnter={startHoverTimer}
        onMouseLeave={clearHoverTimer}
        onFocus={startHoverTimer}
        onBlur={clearHoverTimer}
      >{word}{trailing}</button>
      {definition && (
        <span className="nir-definition" id={id}>
          <span className="nir-definition-label">Definition {String(depth + 1).padStart(2, "0")} <span>· {definition.source === "wordnet" ? `offline lexicon · ${{ n: "noun", v: "verb", a: "adjective", r: "adverb" }[definition.partOfSpeech ?? "n"]}` : definition.source === "pending" ? "checking" : "case file"}</span></span>
          <strong>{word}{definition.lemma && definition.lemma !== word.toLowerCase() ? ` → ${definition.lemma}` : ""}</strong>
          <span className="nir-definition-text">{definition.source === "pending"
            ? definition.meaning
            : <DefinitionText text={definition.meaning} depth={depth + 1} />}</span>
        </span>
      )}
    </span>
  );
}

function DefinitionText({ text, depth = 0 }: { text: string; depth?: number }) {
  const parts = text.split(/([A-Za-z]+(?:[’'-][A-Za-z]+)*)/g);
  return (
    <span className="nir-definition-words">
      {parts.map((part, index) => /[A-Za-z]/.test(part) && /^[A-Za-z’'-]+$/.test(part)
        ? <DefinitionWord word={part} depth={depth} key={`${index}-${part}`} />
        : <span key={`${index}-${part}`}>{part}</span>)}
    </span>
  );
}

function Words({ children }: { children: string }) {
  return <DefinitionText text={children} />;
}

export function NiranjanPage() {
  return (
    <div className="niranjan-page" style={{ "--nir-hover-delay": `${HOVER_OPEN_DELAY_MS}ms` } as CSSProperties}>
      <div className="nir-orbit nir-orbit-one" aria-hidden="true" />
      <div className="nir-orbit nir-orbit-two" aria-hidden="true" />
      <div className="nir-page-frame">
        <header className="nir-masthead">
          <span className="nir-index"><Words>CASE FILE ∞ / MATHEMATICAL CONTAINMENT UNIT</Words></span>
          <div className="nir-masthead-main"><div><p className="nir-kicker"><Words>Subject: still checking the premise</Words></p><h1><DefinitionWord word="NIRANJAN" depth={0} trailing={<span className="nir-infinity">∞</span>} /></h1><p className="nir-deck"><Words>A modest, award-winning threat to every unexamined assumption in the room.</Words></p></div><div className="nir-hero-gif"><img src="/assets/images/niranjan-raised-eyebrows.gif" alt="Niranjan raising his eyebrows at an insufficiently rigorous proof" /><span><Words>PROOF INSPECTOR // LIVE FEED</Words></span></div></div>
          <div className="nir-ticker"><span><Words>DEFINE THE DEFINITION</Words></span><span><Words>PROVE THE PROOF</Words></span><span><Words>DEFINE THE DEFINITION</Words></span><span><Words>PROVE THE PROOF</Words></span></div>
        </header>

        <main>
          <section className="nir-intro">
            <div className="nir-intro-copy"><span className="nir-kicker"><Words>01 / The premise</Words></span><h2><Words>No term may enter without papers.</Words></h2><p><Words>Ask Niranjan for a definition. He will ask what you mean by “ask.” Clarify “ask” and he will need a definition of “clarify.” At some point the dictionary becomes a courtroom, every word is a witness, and the witnesses demand dictionaries of their own.</Words></p><p><Words>He requires a hyperrigorous proof of everything. Not just the theorem: the notation, the axioms, the meaning of “therefore,” and whether your confidence is itself justified.</Words></p></div>
            <figure className="nir-image nir-image-intro"><img src="/assets/images/niranjan-reaching-over.jpg" alt="Niranjan leaning in to inspect an argument" /><figcaption><Words>He has reached over to check an unstated assumption.</Words></figcaption></figure>
          </section>

          <section className="nir-recursion" aria-labelledby="nir-recursion-title">
            <div className="nir-recursion-head"><span className="nir-kicker"><Words>02 / A dictionary with no final page</Words></span><h2 id="nir-recursion-title"><Words>Definition of definition of definition.</Words></h2><p><Words>One term has entered the record. Its consequences are under review.</Words></p></div>
            <div className="nir-recursion-stage"><div className="nir-stage-mark" aria-hidden="true">∞</div><div className="nir-stage-note"><Words>EXHIBIT D // FIRST PRINCIPLES</Words></div><div className="nir-seed"><DefinitionText text="A definition is a proof that a word has a meaning. But meaning requires a definition, and that definition requires another proof." /></div><div className="nir-stage-footer"><Words>There is no last word. There is only the next one. ↓</Words><span className="nir-wordnet-credit"><Words>Offline lexicon: WordNet 3.1 · </Words><a href="/assets/dictionary/WORDNET-LICENSE.txt" aria-label="Read WordNet license">↗</a></span></div></div>
          </section>

          <section className="nir-dossier">
            <article className="nir-awards"><span className="nir-kicker"><Words>03 / An extremely modest collection</Words></span><h2><Words>“I really don’t deserve all these math awards.”</Words></h2><p><Words>Niranjan would never claim to be the best. He merely wins the math awards, thanks everyone with suspicious sincerity, and explains that his proof was probably inadequate. The trophies keep arriving. His humility is now the most decorated object in the building.</Words></p><figure className="nir-image"><img src="/assets/images/niranjan-asserting-supremacy.png" alt="Niranjan raising one finger while asserting a mathematical point" /><figcaption><Words>One finger raised. Several prizes reluctantly accepted.</Words></figcaption></figure></article>
            <article className="nir-physical"><span className="nir-kicker"><Words>04 / Preparation for the long proof</Words></span><h2><Words>Even the warm-up has lemmas.</Words></h2><p><Words>The other students do push-ups. Niranjan requests a precise definition of “up,” proves the ground exists, and only then begins. His argument about form outlasts everyone else’s set.</Words></p><figure className="nir-image"><img src="/assets/images/niranjan-pushups.png" alt="Niranjan and friends doing push-ups" /><figcaption><Words>The body is down. The standard of proof remains up.</Words></figcaption></figure></article>
          </section>

          <section className="nir-containment"><figure className="nir-image"><img src="/assets/images/niranjan-locked-up.jpg" alt="Niranjan standing behind a fence" /><figcaption><Words>Containment perimeter. Adequacy of perimeter not yet proven.</Words></figcaption></figure><div><span className="nir-kicker"><Words>05 / Containment status: mathematically unresolved</Words></span><h2><Words>Locked up for being too dangerous.</Words></h2><p><Words>They put Niranjan behind a fence after he tried to solve all of math. He immediately asked for a proof that the fence is a fence, that “behind” has a consistent definition, and that mathematics can in fact be contained by chain link.</Words></p><p><Words>The appeal is still in progress. So is the proof. So is the definition of “progress.”</Words></p><div className="nir-warning"><Words>WARNING: SUBJECT WILL CONTINUE SOLVING MATH</Words></div></div></section>

          <section className="nir-endless" aria-label="The argument continues"><span><Words>Q.E.D.?</Words></span><strong><Words>Not yet.</Words></strong><p><Words>The conclusion refers back to its premise. The premise refers back to its definition. The definition is waiting above, where you left it open.</Words></p><div className="nir-endless-track" aria-hidden="true">∞ ∴ ∞ ∴ ∞ ∴ ∞ ∴ ∞ ∴ ∞ ∴ ∞ ∴ ∞ ∴</div></section>
        </main>
      </div>
    </div>
  );
}
