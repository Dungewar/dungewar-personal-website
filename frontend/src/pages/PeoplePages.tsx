import { ReactNode } from "react";
import { Layout } from "../components/Layout";

type Feature = {
  title: string;
  copy: ReactNode;
  image: string;
  alt: string;
};

function PersonPage({ name, subtitle, theme, features }: { name: string; subtitle: string; theme: string; features: Feature[] }) {
  return (
    <Layout wide>
      <article className={`person-page ${theme}`}>
        <header className="person-hero">
          <p className="eyebrow">The extended cast</p>
          <h1>{name}</h1>
          <p>{subtitle}</p>
        </header>
        <div className="person-features">
          {features.map((feature, index) => (
            <section className="person-feature" key={feature.title}>
              <div className="person-copy"><span>{String(index + 1).padStart(2, "0")}</span><h2>{feature.title}</h2><div>{feature.copy}</div></div>
              <img src={feature.image} alt={feature.alt} />
            </section>
          ))}
        </div>
      </article>
    </Layout>
  );
}

export function OlgierdPage() {
  return <PersonPage name="Olgierd Matusiewicz" subtitle="Factory architect, gear appreciator, and the person responsible for this website." theme="factory" features={[
    { title: "Hi, I’m Olgierd", image: "/assets/images/olgierd-pizza-gear.jpg", alt: "Olgierd holding pizza and wearing gears", copy: <p>If you’re looking at my eyes right now, you’re probably wondering why they have the approximate luster of a rusted copper plate. The short answer is Factorio. The long answer is a declaration of purpose.</p> },
    { title: "Olgierd ❌ All Geared ✅", image: "/assets/images/olgierd-middle-finger.png", alt: "Olgierd making an emphatic gesture", copy: <><p>I’m a Factorio addict, and I say that with the confidence a CEO says, “I have a yacht.” I’m not trying to recover; I’m trying to hit 10k Science Per Minute.</p><p>Why spend three hours on laundry when I could fix a throughput bottleneck in my blue-chip circuit line?</p></> },
    { title: "The factory waits for no one", image: "/assets/images/factorio-review.png", alt: "A Factorio review", copy: <><p>The struggle is accepting that I need to fit eight hours of “sleep” into a 24-hour cycle when I could pave the entire map in concrete.</p><p>I do not need a sponsor. I need a faster belt-speed mod.</p></> },
  ]} />;
}

export function MaxPage() {
  return <PersonPage name="Max Shi" subtitle="A totally normal guy with a height, a weight, and several items of personal property." theme="maximal" features={[
    { title: "Who is Max Shi?", image: "/assets/images/max-cube.png", alt: "A cube-like puzzle", copy: <><p>I was born sometime on a Tuesday. My early life consisted mostly of growing up, which, upon reflection, is what most people do.</p><p>My hobbies include engaging in various activities during my free time and occasionally observing things.</p></> },
    { title: "Current status", image: "/assets/images/max-screenie.png", alt: "A screenshot of an interface", copy: <><p>My occupation involves processing data and occasionally observing system metrics. I interact with colleagues in a standard professional manner.</p><p>My personal philosophy is to exist. My goal is to continue existing for an unspecified duration.</p></> },
  ]} />;
}

export function QinzhaoPage() {
  return <PersonPage name="Qinzhao Li" subtitle="Expression without apology; confidence without the boring parts." theme="qinzhao" features={[
    { title: "On my own terms", image: "/assets/images/qinzhao-pog-face.png", alt: "Qinzhao posing", copy: <p>I approach identity with self-awareness, confidence, and a strong belief in personal expression. I’m comfortable embracing feminine aesthetics and rejecting rigid expectations.</p> },
    { title: "Expression and fluidity", image: "/assets/images/qinzhao-maid-held.png", alt: "Qinzhao with a friend", copy: <p>Personal expression should not be boxed in by outdated norms. Masculinity and femininity are not opposing forces; they are traits that can coexist without contradiction.</p> },
    { title: "Authenticity first", image: "/assets/images/qinzhao-pepega.png", alt: "Qinzhao making a playful face", copy: <p>I value honesty, mutual respect, and personal freedom. Clear dialogue beats assumptions, and living openly beats shrinking to fit somebody else’s categories.</p> },
  ]} />;
}

export function RohanPage() {
  return <PersonPage name="Rohan Nadkarni" subtitle="Violin virtuoso. Cheese connoisseur. Beryllium enthusiast." theme="rohan" features={[
    { title: "The 16-hour grind", image: "/assets/images/rohan-1.jpg", alt: "Rohan playing violin", copy: <p>Sleep is for people who do not practice scales. If I am awake, I am bowing. Practice: 16 hours. Sleep: optional. Violin: on fire.</p> },
    { title: "The sustenance", image: "/assets/images/rohan-2.jpg", alt: "Rohan eating cheese", copy: <p>My body runs on 100% sharp cheddar. Lactose intolerance is a state of mind that I have defeated.</p> },
    { title: "PvZ strategy", image: "/assets/images/rohan-3.jpg", alt: "Rohan contemplating strategy", copy: <p>While practicing Paganini with my left hand, I calculate optimal zombie placement with my right foot. My deck has no weakness.</p> },
    { title: "Atomic number four", image: "/assets/images/rohan-4.jpg", alt: "Rohan surrounded by green", copy: <p>Why is beryllium so good? It is green. I am green. This may be because of the mold on the cheese I ate.</p> },
  ]} />;
}
