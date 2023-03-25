import WordHero from "@/components/WordHero";

export default function Word() {
  return (
    <WordHero
      word="ocean"
      pieces={[
        { characters: "o", phoneme: "ˈoʊ" },
        { characters: "ce", phoneme: "ʃ" },
        { characters: "an", phoneme: "ən" },
      ]}
    ></WordHero>
  );
}
