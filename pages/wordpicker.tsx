import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";
import useSWRImmutable from "swr/immutable";

import BigRedLink from "@/components/BigRedLink";
import Header from "@/components/Header";
import RoundPort from "@/components/RoundPort";
import { mapGradeToText } from "@/utils/text";

import "react-loading-skeleton/dist/skeleton.css";

const fetcher = (input: RequestInfo | URL, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json());

export default function WordPicker() {
  const router = useRouter();
  const { phonemes, characters, grade } = router.query;

  const phonemeSpecific =
    typeof phonemes === "string" && typeof characters === "string";

  const validGrade = typeof grade === "string";

  let url;
  if (!validGrade) {
    url = null;
  } else if (phonemeSpecific) {
    url = `/api/words?grade=${encodeURIComponent(
      grade
    )}&phonemes=${encodeURIComponent(phonemes)}&characters=${encodeURIComponent(
      characters
    )}`;
  } else {
    url = `/api/words?grade=${encodeURIComponent(grade)}`;
  }

  const { data: wordsResponse, error: wordsError } = useSWRImmutable(
    url,
    fetcher
  );

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
    heading = `Words with ${characters} (${
      phonemes === "" ? "silent" : phonemes + " sound"
    })`;
  } else {
    heading = `${mapGradeToText(grade)} Words`;
  }

  return (
    <RoundPort>
      <div className="flex flex-col">
        <Header />
        <div className="flex-1"></div>
        <h1 className="m-4 text-center text-3xl font-bold text-panda">
          {heading}
        </h1>
        <div className="m-2 grid grid-cols-2 gap-3 placeholder:font-bold lg:m-8 lg:grid-cols-3 lg:grid-rows-3 lg:gap-4">
          {words.map((word) => (
            <BigRedLink key={word} href={`/word?grade=${grade}&word=${word}`}>
              {word}
            </BigRedLink>
          ))}
        </div>
        <div className="flex-1"></div>
      </div>
    </RoundPort>
  );

  return <div></div>;
}
