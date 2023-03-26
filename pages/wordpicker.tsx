import { useRouter } from "next/router";

import useSWR from "swr";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import BigRedLink from "@/components/BigRedLink";
import RoundPort from "@/components/RoundPort";

const fetcher = (input: RequestInfo | URL, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json());

export default function WordPicker() {
  const router = useRouter();
  const { phoneme, characters, grade } = router.query;

  const phonemeSpecific =
    typeof phoneme === "string" && typeof characters === "string";

  const validGrade = typeof grade === "string";

  let url;
  if (!validGrade) {
    url = null;
  } else if (phonemeSpecific) {
    url = `/api/words?grade=${encodeURIComponent(
      grade
    )}&phoneme=${encodeURIComponent(phoneme)}&characters=${encodeURIComponent(
      characters
    )}`;
  } else {
    url = `/api/words?grade=${encodeURIComponent(grade)}`;
  }

  const { data: wordsResponse, error: wordsError } = useSWR(url, fetcher);

  if (!validGrade) {
    return <div>Error: Need a grade.</div>;
  }

  if (wordsError) {
    return <div>There was an error calling the API.</div>;
  }

  if (!wordsResponse) {
    return (
      <RoundPort>
        <Skeleton />
      </RoundPort>
    );
  }

  let { words, error: wordsResponseError } = wordsResponse;

  if (wordsResponseError) {
    return <div>There was an error calling the API.</div>;
  }

  if (!Array.isArray(words)) {
    return <div>There was an error calling the API.</div>;
  }

  let heading;

  if (phonemeSpecific) {
    heading = `Words with ${characters} (${phoneme})`;
  } else {
    heading = `Grade ${grade} Words`;
  }

  return (
    <RoundPort>
      <h1 className="text-3xl text-panda text-center font-bold">{heading}</h1>
      <div className="grid grid-cols-3 grid-rows-2 gap-4 font-bold">
        {words.map((word) => (
          <BigRedLink key={word} href={`/word?grade=${grade}&word=${word}`}>
            {word}
          </BigRedLink>
        ))}
      </div>
    </RoundPort>
  );

  return <div></div>;
}
