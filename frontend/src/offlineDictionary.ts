export type Definition = {
  meaning: string;
  source: "dossier" | "wordnet" | "pending";
  lemma?: string;
  partOfSpeech?: string;
};

type WordNetEntry = Partial<Record<"n" | "v" | "a" | "r", string>>;
type WordAlias = { lemma: string; partOfSpeech: "n" | "v" | "a" };
type DictionaryBucket = {
  definitions: Record<string, WordNetEntry>;
  aliases: Record<string, WordAlias>;
};

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
  wordnet: "A lexical database grouping English nouns, verbs, adjectives, and adverbs by their meanings.",
  solve: "To reach an answer and then prove that the answer, the question, and every term in between were well defined.",
  a: "An indefinite article introducing one unspecified member of a group.",
  an: "The indefinite article used before a vowel sound.",
  i: "The first-person pronoun used by a speaker to refer to themself.",
  the: "The definite article pointing to a particular thing already identified or understood.",
  of: "A preposition connecting a thing with what it belongs to or is made from.",
  to: "A preposition or infinitive marker indicating direction, purpose, or an action.",
  and: "A conjunction joining words, statements, or arguments together.",
  or: "A conjunction presenting an alternative that Niranjan will demand you make precise.",
  but: "A conjunction introducing a contrast to what was just stated.",
  is: "The present singular form of be: to exist, equal, or possess a property.",
  are: "The present plural form of be: to exist, equal, or possess a property.",
  was: "The past singular form of be.",
  were: "The past plural form of be.",
  be: "To exist or to have a specified identity or property.",
  been: "The past participle of be.",
  he: "A pronoun referring to a male person previously identified.",
  his: "A possessive word referring to something belonging to him.",
  him: "A pronoun referring to a male person as the object of an action.",
  it: "A pronoun referring to a thing or idea already mentioned.",
  its: "A possessive word referring to something belonging to it.",
  you: "A pronoun referring to the person being addressed.",
  your: "A possessive word referring to something belonging to you.",
  we: "A pronoun referring to a group that includes the speaker.",
  they: "A pronoun referring to people or things already mentioned.",
  them: "A pronoun referring to those people or things as the object of an action.",
  their: "A possessive word referring to something belonging to them.",
  this: "A word pointing to the thing or idea immediately present.",
  that: "A word pointing to a thing, idea, or clause already identified.",
  these: "The plural of this.",
  those: "The plural of that.",
  in: "A preposition indicating inclusion within a place, time, or idea.",
  on: "A preposition indicating position upon a surface or involvement in a subject.",
  at: "A preposition marking a place, point, time, or target.",
  for: "A preposition marking purpose, benefit, or the object of an argument.",
  from: "A preposition indicating the source or starting point.",
  with: "A preposition indicating accompaniment or a means of doing something.",
  as: "A conjunction or preposition indicating a role, comparison, or manner.",
  if: "A conjunction introducing a condition that may or may not hold.",
  not: "A word negating the statement that follows it.",
  no: "A word indicating absence, refusal, or negation.",
  can: "A modal verb indicating ability or possibility.",
  could: "A modal verb indicating ability or possibility under a condition.",
  would: "A modal verb indicating an imagined or conditional action.",
  should: "A modal verb indicating expectation or obligation.",
  will: "A modal verb indicating a future action or intention.",
  may: "A modal verb indicating permission or possibility.",
  do: "To perform an action, or to serve as an auxiliary verb in a question or negation.",
  does: "The third-person singular form of do.",
  did: "The past form of do.",
  dont: "A contraction of do not, expressing negation.",
  doesnt: "A contraction of does not, expressing negation.",
  didnt: "A contraction of did not, expressing negation.",
  cant: "A contraction of cannot, expressing impossibility.",
  wont: "A contraction of will not, expressing refusal or future negation.",
  has: "The third-person singular form of have.",
  have: "To possess, experience, or hold something.",
};

const bucketCache = new Map<string, Promise<DictionaryBucket>>();
const definitionCache = new Map<string, Promise<Definition>>();

function fallbackDefinition(word: string): Definition {
  return {
    meaning: `A word used in this argument. Its exact meaning remains under review until ${word} and every word in this sentence have been defined.`,
    source: "dossier",
  };
}

function loadBucket(letter: string): Promise<DictionaryBucket> {
  const cached = bucketCache.get(letter);
  if (cached) return cached;
  const request = fetch(`/assets/dictionary/${letter}.json`)
    .then((response) => {
      if (!response.ok) throw new Error(`Offline dictionary returned ${response.status}`);
      return response.json() as Promise<DictionaryBucket>;
    });
  bucketCache.set(letter, request);
  return request;
}

async function lookUp(word: string, key: string): Promise<Definition> {
  const exactBucket = await loadBucket(key[0]);
  const exact = exactBucket.definitions[key];
  if (exact) {
    const partOfSpeech = (["n", "v", "a", "r"] as const).find((code) => exact[code]);
    if (partOfSpeech) return { meaning: exact[partOfSpeech] ?? "", source: "wordnet", lemma: key, partOfSpeech };
  }

  const alias = exactBucket.aliases[key];
  if (alias) {
    const custom = localDefinitions[alias.lemma];
    if (custom) return { meaning: custom, source: "dossier", lemma: alias.lemma };
    const baseBucket = alias.lemma[0] === key[0] ? exactBucket : await loadBucket(alias.lemma[0]);
    const meaning = baseBucket.definitions[alias.lemma]?.[alias.partOfSpeech];
    if (meaning) return { meaning, source: "wordnet", lemma: alias.lemma, partOfSpeech: alias.partOfSpeech };
  }
  return fallbackDefinition(word);
}

export function getDefinition(word: string): Promise<Definition> {
  const key = word.toLowerCase().replace(/[’']/g, "").replace(/[^a-z]/g, "");
  if (!key) return Promise.resolve(fallbackDefinition(word));
  const custom = localDefinitions[key];
  if (custom) return Promise.resolve({ meaning: custom, source: "dossier", lemma: key });

  const cached = definitionCache.get(key);
  if (cached) return cached;
  const request = lookUp(word, key).catch(() => fallbackDefinition(word));
  definitionCache.set(key, request);
  return request;
}
