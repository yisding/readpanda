import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";
import useSWRImmutable from "swr/immutable";

import Header from "@/components/Header";
import RoundPort from "@/components/RoundPort";
import WordHero from "@/components/WordHero";

import "react-loading-skeleton/dist/skeleton.css";

import Image from "next/image";
import Link from "next/link";

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

  const { data: piecesResponse, error: piecesError } = useSWRImmutable(
    piecesUrl,
    fetcher
  );

  const { data: imageResponse, error: imageError } = useSWRImmutable(
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
      <div className="flex h-full w-full flex-col">
        <div className="flex flex-row items-center">
          <Link href={`/chat?word=${encodeURIComponent(word)}`}>
            <Image
              src="/yoda-avatar.png"
              alt="logo"
              height={80}
              width={80}
              className="h-12 w-12 lg:h-20 lg:w-20"
            />
          </Link>
          <div className="mx-2 text-2xl font-bold text-panda lg:mx-4 lg:text-4xl">
            <Link href="/">Home</Link>
          </div>
        </div>
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
