import { useId, useState } from "react";
import "./NiranjanPage.css";

type DictionaryEntry = {
  meanings?: Array<{
    partOfSpeech?: string;
    definitions?: Array<{ definition?: string }>;
  }>;
};

type Definition = { meaning: string; source: "dossier" | "dictionary" | "pending" };

const localDefinitions: Record<string, string> = {
  niranjan: "A person who insists that a definition be defined before its definition can be used in a proof.",
  definition: "A statement that fixes the meaning of a word by using other words whose meanings must also be fixed.",
  definitions: "Statements that fix meanings, each requiring further statements to explain the words inside them.",
  proof: "A sequence of justified statements for which every assumption, implication, and definition has survived inspection.",
  proofs: "Sequences of justified statements that Niranjan considers unfinished until their smallest assumptions are proven.",
  rigorous: "Accepting no step until the step, the reason for the step, and the meaning of reason have been established.",
  hyperrigorous: "More rigorous than rigorous, pending a rigorous definition of more.",
  humble: "A quality Niranjan insists he possesses while another mathematics award is placed beside the previous mathematics awards.",
  humility: "The act of describing one's many victories as a small and probably undeserved administrative coincidence.",
  award: "A recognition Niranjan accepts reluctantly while quietly making room for the next recognition.",
  awards: "Recognitions Niranjan accepts reluctantly while quietly making room for the next recognitions.",
  dangerous: "Capable of continuing a mathematical argument after every other participant has gone home.",
  locked: "Placed behind a boundary that has not yet been proven sufficient to contain a proof.",
  mathematics: "A field of precise ideas in which Niranjan keeps asking what precise and idea mean.",
  math: "A shorter word for mathematics, whose shortening Niranjan would like you to justify.",
  solve: "To reach an answer and then prove that the answer, the question, and every term in between were well defined.",
};

const definitionCache = new Map<string, Promise<Definition>>();

function fallbackDefinition(word: string): Definition {
  return {
    meaning: `A word used in this argument. Its exact meaning remains under review until ${word} and every word in this sentence have been defined.`,
    source: "dossier",
  };
}

function getDefinition(word: string): Promise<Definition> {
  const key = word.toLowerCase().replace(/[’']/g, "").replace(/[^a-z]/g, "");
  const custom = localDefinitions[key];
  if (custom) return Promise.resolve({ meaning: custom, source: "dossier" });

  const cached = definitionCache.get(key);
  if (cached) return cached;

  const request = fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`)
    .then(async (response) => {
      if (!response.ok) throw new Error(`Dictionary returned ${response.status}`);
      const entries = await response.json() as DictionaryEntry[];
      const meaning = entries.flatMap((entry) => entry.meanings ?? [])
        .flatMap((entry) => entry.definitions ?? [])
        .map((entry) => entry.definition?.trim())
        .find((value): value is string => Boolean(value));
      return meaning ? { meaning, source: "dictionary" as const } : fallbackDefinition(word);
    })
    .catch(() => fallbackDefinition(word));
  definitionCache.set(key, request);
  return request;
}

function DefinitionWord({ word, depth }: { word: string; depth: number }) {
  const [definition, setDefinition] = useState<Definition | null>(null);
  const id = useId();
  const open = () => {
    if (definition) return;
    setDefinition({ meaning: "Meaning requested. The proof of the meaning is pending.", source: "pending" });
    void getDefinition(word).then(setDefinition);
  };

  return (
    <span className={definition ? "nir-word nir-word-open" : "nir-word"}>
      <button type="button" aria-expanded={Boolean(definition)} aria-controls={id} onClick={open} title={`Define ${word}`}>{word}</button>
      {definition && (
        <span className="nir-definition" id={id}>
          <span className="nir-definition-label">Definition {String(depth + 1).padStart(2, "0")} <span>· {definition.source === "dictionary" ? "dictionary" : definition.source === "pending" ? "checking" : "case file"}</span></span>
          <strong>{word}</strong>
          <span className="nir-definition-text">{definition.source === "pending"
            ? definition.meaning
            : <DefinitionText text={definition.meaning} depth={depth + 1} />}</span>
          <span className="nir-definition-next">Every word above is another door. None of them close. ↘</span>
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

export function NiranjanPage() {
  return (
    <div className="niranjan-page">
      <div className="nir-orbit nir-orbit-one" aria-hidden="true" />
      <div className="nir-orbit nir-orbit-two" aria-hidden="true" />
      <div className="nir-page-frame">
        <header className="nir-masthead">
          <span className="nir-index">CASE FILE ∞ / MATHEMATICAL CONTAINMENT UNIT</span>
          <div className="nir-masthead-main"><div><p className="nir-kicker">Subject: still checking the premise</p><h1>NIRANJAN<span>∞</span></h1><p className="nir-deck">A modest, award-winning threat to every unexamined assumption in the room.</p></div><div className="nir-hero-gif"><img src="/assets/images/niranjan-raised-eyebrows.gif" alt="Niranjan raising his eyebrows at an insufficiently rigorous proof" /><span>PROOF INSPECTOR // LIVE FEED</span></div></div>
          <div className="nir-ticker" aria-hidden="true"><span>DEFINE THE DEFINITION</span><span>PROVE THE PROOF</span><span>DEFINE THE DEFINITION</span><span>PROVE THE PROOF</span></div>
        </header>

        <main>
          <section className="nir-intro">
            <div className="nir-intro-copy"><span className="nir-kicker">01 / The premise</span><h2>No term may enter without papers.</h2><p>Ask Niranjan for a definition. He will ask what you mean by “ask.” Clarify “ask” and he will need a definition of “clarify.” At some point the dictionary becomes a courtroom, every word is a witness, and the witnesses demand dictionaries of their own.</p><p>He requires a hyperrigorous proof of everything. Not just the theorem: the notation, the axioms, the meaning of “therefore,” and whether your confidence is itself justified.</p></div>
            <figure className="nir-image nir-image-intro"><img src="/assets/images/niranjan-reaching-over.jpg" alt="Niranjan leaning in to inspect an argument" /><figcaption>He has reached over to check an unstated assumption.</figcaption></figure>
          </section>

          <section className="nir-recursion" aria-labelledby="nir-recursion-title">
            <div className="nir-recursion-head"><span className="nir-kicker">02 / A dictionary with no final page</span><h2 id="nir-recursion-title">Definition of definition of definition.</h2><p>Click any word. Its meaning appears below it. Then click any word in that meaning. Opened definitions remain in the record forever.</p></div>
            <div className="nir-recursion-stage"><div className="nir-stage-mark" aria-hidden="true">∞</div><div className="nir-stage-note">EXHIBIT D // TAP A WORD TO BEGIN</div><div className="nir-seed"><DefinitionText text="A definition is a proof that a word has a meaning. But meaning requires a definition, and that definition requires another proof." /></div><div className="nir-stage-footer">There is no last word. There is only the next one. ↓</div></div>
          </section>

          <section className="nir-dossier">
            <article className="nir-awards"><span className="nir-kicker">03 / An extremely modest collection</span><h2>“I really don’t deserve all these math awards.”</h2><p>Niranjan would never claim to be the best. He merely wins the math awards, thanks everyone with suspicious sincerity, and explains that his proof was probably inadequate. The trophies keep arriving. His humility is now the most decorated object in the building.</p><figure className="nir-image"><img src="/assets/images/niranjan-asserting-supremacy.png" alt="Niranjan raising one finger while asserting a mathematical point" /><figcaption>One finger raised. Several prizes reluctantly accepted.</figcaption></figure></article>
            <article className="nir-physical"><span className="nir-kicker">04 / Preparation for the long proof</span><h2>Even the warm-up has lemmas.</h2><p>The other students do push-ups. Niranjan requests a precise definition of “up,” proves the ground exists, and only then begins. His argument about form outlasts everyone else’s set.</p><figure className="nir-image"><img src="/assets/images/niranjan-pushups.png" alt="Niranjan and friends doing push-ups" /><figcaption>The body is down. The standard of proof remains up.</figcaption></figure></article>
          </section>

          <section className="nir-containment"><figure className="nir-image"><img src="/assets/images/niranjan-locked-up.jpg" alt="Niranjan standing behind a fence" /><figcaption>Containment perimeter. Adequacy of perimeter not yet proven.</figcaption></figure><div><span className="nir-kicker">05 / Containment status: mathematically unresolved</span><h2>Locked up for being too dangerous.</h2><p>They put Niranjan behind a fence after he tried to solve all of math. He immediately asked for a proof that the fence is a fence, that “behind” has a consistent definition, and that mathematics can in fact be contained by chain link.</p><p>The appeal is still in progress. So is the proof. So is the definition of “progress.”</p><div className="nir-warning">WARNING: SUBJECT WILL CONTINUE SOLVING MATH</div></div></section>

          <section className="nir-endless" aria-label="The argument continues"><span>Q.E.D.?</span><strong>Not yet.</strong><p>The conclusion refers back to its premise. The premise refers back to its definition. The definition is waiting above, where you left it open.</p><div className="nir-endless-track" aria-hidden="true">∞ ∴ ∞ ∴ ∞ ∴ ∞ ∴ ∞ ∴ ∞ ∴ ∞ ∴ ∞ ∴</div></section>
        </main>
      </div>
    </div>
  );
}
