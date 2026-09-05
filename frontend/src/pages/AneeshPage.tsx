import type { ReactNode } from "react";

type Mandate = { tag: string; title: string; theme: string; image: string; alt: string; caption: string; copy: ReactNode };

const mandates: Mandate[] = [
  {
    tag: "Core Campaign Manifesto", title: "The Unbreakable Monolith: Uniting the Entire Situation", theme: "campaign", image: "/assets/images/aneesh-patriotic.jpg", alt: "Aneesh Raghavan presenting the Unbreakable Mandate", caption: "Exhibit A: Candidate Aneesh Raghavan presenting the Unbreakable Mandate to the citizenry.",
    copy: <><p>Citizens. Observers. Neighbors. The era of fractional dispersion has officially expired. Under my uncompromising leadership, the country will be welded together into a single, cohesive, frictionless apparatus.</p><p>Detractors ask what position I am running for. This question is proof of institutional weakness. I am running for the <strong>Ultimate General Direction</strong>.</p></>,
  },
  {
    tag: "Athletic Distinction", title: "Professional Hydrodynamics & Freestyle Superiority", theme: "swimming", image: "/assets/images/aneesh-swimming.jpg", alt: "Aneesh Raghavan performing competitive swimming", caption: "Exhibit B: Aneesh maintaining elite hydrodynamic propulsion during professional training.",
    copy: <><p>When my human form enters the designated aquatic corridor, fluid displacement is achieved with maximum geometric efficiency. Resistance is merely an invitation for higher bilateral kicking frequencies.</p><p>I swim 8,000 meters before dawn simply to establish biological dominance over the chlorine.</p></>,
  },
  {
    tag: "National Infrastructure", title: "Mobilizing the Instruments of Absolute Production", theme: "campaign", image: "/assets/images/aneesh-communist-tools.jpg", alt: "Aneesh with the official tools of production", caption: "Exhibit C: Aneesh brandishing the official apparatus of state-level collective resolve.",
    copy: <><p>Under Section 4-B, all citizens will be issued appropriate tooling for the Grand Reconstruction. What are we building? <strong>Everything.</strong> Where will it be placed? <strong>Directly where it belongs.</strong></p><ul><li>Triple the output.</li><li>Eliminate ambient dithering.</li><li>Deliver 40 monthly units of unwavering commitment.</li><li>Declare all future problems permanently finished.</li></ul></>,
  },
  {
    tag: "Nutritional Philosophy", title: "Affection for High-Grade Artisanal Plastic Cheese", theme: "cheese", image: "/assets/images/aneesh-eating-plastic-cheese.png", alt: "Aneesh eating individually wrapped cheese", caption: "Exhibit D: Aneesh tactically ingesting single-slice American pasteurized cheese product.",
    copy: <><p>Cheese is undeniable. I require high tensile elasticity, bright synthetic yellow pigmentation, and an individually heat-sealed plastic wrapper.</p><p>Does it contain calcium? That is between the manufacturer and the FDA. The texture is sublime.</p></>,
  },
  {
    tag: "Accountability Bureau", title: "Profound Disappointment in Those Requesting “Details”", theme: "campaign", image: "/assets/images/aneesh-disappointed.jpg", alt: "Aneesh looking disappointed", caption: "Exhibit E: Candidate Raghavan expressing grave disappointment toward citizens lacking revolutionary vigor.",
    copy: <><p>A reporter dared ask how this would be financed. I stared at him for four consecutive minutes without blinking until he apologized to the flag.</p><p>We do not need funding; we need <strong>fervor</strong>. Those who waver will be placed into the Box of Hesitant Individuals.</p></>,
  },
  {
    tag: "Biological Crisis", title: "Severe Clinical Insomnia & Flooring Inspection", theme: "sleep", image: "/assets/images/aneesh-laying-down.jpg", alt: "Aneesh laying down on the floor", caption: "Exhibit F: Aneesh attempting to induce unconsciousness via direct contact with flooring materials.",
    copy: <><p>I have not slept since late October. My neurological system runs on raw cortisol, high voltage, and stubbornness. Every attempt at slumber triggers an audit of every conversation since sixth grade.</p><p>The floor does not judge. The floor provides flat, unyielding support.</p></>,
  },
  {
    tag: "Mobilization Status", title: "UNPRECEDENTED RALLY HYSTERIA: THE RESOLVE PEAKS!", theme: "campaign", image: "/assets/images/aneesh-excited.jpg", alt: "Aneesh extremely excited at a campaign rally", caption: "Exhibit G: Aneesh reaching peak campaign euphoria while announcing zero concrete platform details.",
    copy: <><p>THE MOMENTUM IS IRREVERSIBLE! The flags are waving! No one knows what our tax policy is, and neither do I! THAT IS THE BEAUTY OF THE NEW COALITION!</p><p>VICTORY IS THE ONLY ACCEPTABLE CONCLUSION!</p></>,
  },
  {
    tag: "Sleep Deficit Victory", title: "Emergency Involuntary Dormancy", theme: "sleep", image: "/assets/images/aneesh-sleeping.jpg", alt: "Aneesh completely asleep", caption: "Exhibit H: The Great Unifier completely knocked out in a deep, desperate sleep.",
    copy: <><p>The adrenaline has abruptly evaporated. The biological battery has reached 0.00%. The country can wait. The cerebral cortex has initiated an emergency shutdown.</p><p>Do not poke the leader. If awakened prematurely, he will attempt to swim four laps in the carpet.</p></>,
  },
  {
    tag: "Final Resolution", title: "The Transcendent Blur of Victory", theme: "campaign", image: "/assets/images/aneesh-blurry.png", alt: "Aneesh moving at high speed", caption: "Exhibit I: Aneesh ascending to Mach 4 in the sleep-deprived continuum of national destiny.",
    copy: <><p>We accelerate until reality itself begins to smear at the edges. A vote for Aneesh is a vote for solidarity, Olympic-standard flip turns, processed cheese, and two uninterrupted hours of REM sleep.</p><p>Stand firm. Eat cheese. Dive into the deep end. Sleep when victory is finalized.</p></>,
  },
];

export function AneeshPage() {
  return (
    <div className="aneesh-page">
      <header className="aneesh-banner"><span>Official Mandate Document #001</span><h1>Aneesh Raghavan</h1><p>Unifying the Nation Under Uncompromising Leadership, Unfathomable Decisiveness, and Absolute Order.</p></header>
      <div className="mandate-ticker">[POLICY ALERT]: STRUCTURAL QUOTAS INCREASED BY 300% // NO QUESTIONS AUTHORIZED // SLEEP CYCLES COMPROMISED // WATER: 78°F</div>
      <main className="mandate-list">
        {mandates.map((mandate) => <article className={`mandate-card ${mandate.theme}`} key={mandate.title}><span className="mandate-tag">{mandate.tag}</span><h2>{mandate.title}</h2><div className="mandate-copy">{mandate.copy}</div><figure><img src={mandate.image} alt={mandate.alt} /><figcaption>{mandate.caption}</figcaption></figure></article>)}
      </main>
      <footer className="aneesh-footer"><p>Paid for by the <strong>Raghavan Committee for Vague but Resolute National Unity</strong>.</p><p>Cheese certified by the Department of Elasticity.</p></footer>
    </div>
  );
}
