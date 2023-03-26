import WordHero from "@/components/WordHero";
import { useRouter } from "next/router";

export default function Word() {
  const router = useRouter();
  const { word, grade } = router.query;

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
