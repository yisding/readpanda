import { useRouter } from "next/router";
import useSWR from "swr";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import WordHero from "@/components/WordHero";
import RoundPort from "@/components/RoundPort";

const fetcher = (input: RequestInfo | URL, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json());

export default function Word() {
  const router = useRouter();
  const { word, grade } = router.query;

  const validInput = typeof word === "string" && typeof grade === "string";

  let url;
  if (!validInput) {
    url = null;
  } else {
    url = `/api/wordpieces?word=${encodeURIComponent(
      word
    )}&grade=${encodeURIComponent(grade)}`;
  }

  const { data: pieces, error: piecesError } = useSWR(url, fetcher);

  if (!validInput) {
    return <div>Error: Need a word and grade.</div>;
  }

  if (piecesError) {
    return <div>API error</div>;
  }

  if (!pieces) {
    return <Skeleton />;
  }

  return (
    <RoundPort>
      <WordHero word={word} pieces={pieces}></WordHero>
    </RoundPort>
  );
}
