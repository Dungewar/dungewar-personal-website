import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import lemmatizer from "wink-lemmatizer";
import wordnet from "wordnet-db";

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = join(repositoryRoot, "frontend", "public", "assets", "dictionary");
const partsOfSpeech = [["noun", "n"], ["verb", "v"], ["adj", "a"], ["adv", "r"]];
const definitions = Object.create(null);

for (const [partOfSpeech, code] of partsOfSpeech) {
  const glossesByOffset = new Map();
  const data = readFileSync(join(wordnet.path, `data.${partOfSpeech}`), "utf8");
  for (const line of data.split("\n")) {
    if (!/^\d{8} /.test(line)) continue;
    const divider = line.indexOf("|");
    if (divider < 0) continue;
    const gloss = line.slice(divider + 1).trim().split(/;\s*"/)[0].replace(/\s+/g, " ");
    if (gloss) glossesByOffset.set(line.slice(0, 8), gloss);
  }

  const index = readFileSync(join(wordnet.path, `index.${partOfSpeech}`), "utf8");
  for (const line of index.split("\n")) {
    if (!line || line.startsWith(" ")) continue;
    const fields = line.split(/\s+/);
    const lemma = fields[0];
    if (!/^[a-z]+$/.test(lemma) || definitions[lemma]?.[code]) continue;
    const pointerCount = Number(fields[3]);
    const firstSenseOffset = fields[6 + pointerCount];
    const gloss = glossesByOffset.get(firstSenseOffset);
    if (gloss) {
      definitions[lemma] ??= Object.create(null);
      definitions[lemma][code] = gloss;
    }
  }
}

mkdirSync(outputDir, { recursive: true });
const corpus = [
  ...Object.values(definitions).flatMap((entry) => Object.values(entry)),
  readFileSync(join(repositoryRoot, "frontend", "src", "pages", "NiranjanPage.tsx"), "utf8"),
  readFileSync(join(repositoryRoot, "frontend", "src", "offlineDictionary.ts"), "utf8"),
].join(" ").toLowerCase();
const seenWords = new Set(corpus.match(/\b[a-z]+\b/g) ?? []);
const aliases = Object.create(null);
for (const word of seenWords) {
  if (definitions[word]) continue;
  const candidates = [
    [lemmatizer.verb(word), "v"],
    [lemmatizer.noun(word), "n"],
    [lemmatizer.adjective(word), "a"],
  ];
  const match = candidates.find(([candidate, code]) => candidate !== word && definitions[candidate]?.[code]);
  if (match) aliases[word] = { lemma: match[0], partOfSpeech: match[1] };
}

const buckets = Object.fromEntries("abcdefghijklmnopqrstuvwxyz".split("").map((letter) => [letter, {
  definitions: Object.create(null),
  aliases: Object.create(null),
}]));
for (const [word, meaning] of Object.entries(definitions)) buckets[word[0]].definitions[word] = meaning;
for (const [word, lemma] of Object.entries(aliases)) buckets[word[0]].aliases[word] = lemma;
for (const [letter, bucket] of Object.entries(buckets)) {
  writeFileSync(join(outputDir, `${letter}.json`), JSON.stringify(bucket));
}
copyFileSync(join(repositoryRoot, "node_modules", "wordnet-db", "LICENSE"), join(outputDir, "WORDNET-LICENSE.txt"));
console.log(`Generated ${Object.keys(definitions).length.toLocaleString()} offline WordNet definitions and ${Object.keys(aliases).length.toLocaleString()} base-form aliases in 26 letter buckets.`);
