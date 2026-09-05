import { Layout } from "../components/Layout";

const people = [
  ["Olgierd Matusiewicz", "Website maker and certified gear appreciator.", "/assets/images/olgierd-pizza-gear.jpg", "/pages/olgierd-matusiewicz.html"],
  ["Max Shi", "A totally normal guy with totally normal status.", "/assets/images/max-cube.png", "/pages/max-shi.html"],
  ["Qinzhao Li", "Bold, confident, and extremely page-themed.", "/assets/images/qinzhao-pog-face.png", "/pages/qinzhao-li.html"],
  ["Rohan Nadkarni", "Violin, cheese, beryllium. The full experience awaits.", "/assets/images/rohan-1.jpg", "/pages/rohan-nadkarni.html"],
  ["Aneesh Raghavan", "Uncompromising national leadership, competitive swimming, and cheese.", "/assets/images/aneesh-patriotic.jpg", "/pages/aneesh-raghavan.html"],
  ["Sharvil", "Reluctantly exceptional. Still disappointed. Considerably above the peasants.", "/assets/images/sharvil-dark-creepy.jpg", "/pages/sharvil.html"],
] as const;

export function CastPage() {
  return (
    <Layout wide>
      <section className="page-hero cast-heading">
        <p className="eyebrow">You found the secret</p>
        <h1>The cast</h1>
        <p>Meet the people hiding behind the suspiciously normal website.</p>
      </section>
      <section className="cast-grid">
        {people.map(([name, description, image, href]) => (
          <a className="cast-card" href={href} key={href}>
            <img src={image} alt={name} />
            <div><h2>{name}</h2><p>{description}</p><span>Open profile ↗</span></div>
          </a>
        ))}
      </section>
    </Layout>
  );
}
