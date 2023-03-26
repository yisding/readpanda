import { useRouter } from "next/router";
import useSWR from "swr";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import WordHero from "@/components/WordHero";
import RoundPort from "@/components/RoundPort";
import Header from "@/components/Header";

const fetcher = (input: RequestInfo | URL, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json());

const postFetcher = (input: RequestInfo | URL, init?: RequestInit) =>
  fetch(input, { ...init, method: "POST" }).then((res) => res.json());

export default function Word() {
  const router = useRouter();
  const { word, grade } = router.query;

  const validInput = typeof word === "string" && typeof grade === "string";

  let piecesUrl;
  let imageUrl;
  if (!validInput) {
    piecesUrl = null;
    imageUrl = null;
  } else {
    piecesUrl = `/api/wordpieces?word=${encodeURIComponent(
      word
    )}&grade=${encodeURIComponent(grade)}`;
    imageUrl = `/api/image?word=${encodeURIComponent(word)}`;
  }

  const { data: piecesResponse, error: piecesError } = useSWR(
    piecesUrl,
    fetcher
  );

  const { data: imageResponse, error: imageError } = useSWR(
    imageUrl,
    postFetcher
  );

  if (!validInput) {
    return <div>Error: Need a word and grade.</div>;
  }

  if (piecesError) {
    return <div>API error</div>;
  }

  if (!piecesResponse) {
    return (
      <RoundPort>
        <Skeleton />
      </RoundPort>
    );
  }

  if (piecesResponse.error) {
    return <div>API error</div>;
  }

  return (
    <RoundPort>
      <div className="w-full h-full flex flex-col">
        <Header />
        <div className="flex-1"></div>
        <WordHero
          grade={grade}
          word={word}
          pieces={piecesResponse.pieces}
          image={imageResponse?.url ?? "/search.png"}
        />
        <div className="flex-1"></div>
      </div>
    </RoundPort>
  );
}
