import { useRouter } from "next/router";
import useSWR from "swr";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import BigRedLink from "@/components/BigRedLink";
import RoundPort from "@/components/RoundPort";

const fetcher = (input: RequestInfo | URL, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json());

function WordLevel(props: { word: string; wordGrade: string }) {
  return (
    <div className="text-3xl text-panda text-center font-bold">
      The word {props.word} is a grade {props.wordGrade} word!
    </div>
  );
}

function GradePicker(props: { word?: string }) {
  let urlPrefix;
  if (props.word) {
    urlPrefix = `/word?word=${encodeURIComponent(props.word)}&grade=`;
  } else {
    urlPrefix = "/wordpicker?grade=";
  }

  return (
    <div>
      <h1 className="text-3xl text-panda text-center font-bold">
        What grade are you in?
      </h1>
      <div className="grid grid-cols-3 grid-rows-2 gap-4 font-bold">
        <BigRedLink href={`${urlPrefix}K`}>Kindergarten</BigRedLink>
        <BigRedLink href={`${urlPrefix}1`}>1st</BigRedLink>
        <BigRedLink href={`${urlPrefix}2`}>2nd</BigRedLink>
        <BigRedLink href={`${urlPrefix}3`}>3rd</BigRedLink>
        <BigRedLink href={`${urlPrefix}4`}>4th</BigRedLink>
        <BigRedLink href={`${urlPrefix}5`}>5th</BigRedLink>
      </div>
    </div>
  );
}

export default function Grade() {
  const router = useRouter();
  const { word, grade } = router.query;

  const { data: wordGradeResponse, error: wordGradeError } = useSWR(
    typeof word === "string"
      ? `/api/wordgrade?word=${encodeURIComponent(word)}`
      : null,
    fetcher
  );

  if (typeof word !== "string" || wordGradeError) {
    return (
      <RoundPort>
        <GradePicker />
      </RoundPort>
    );
  }

  if (!wordGradeResponse) {
    return (
      <RoundPort>
        <Skeleton />
      </RoundPort>
    );
  }

  const wordGrade = wordGradeResponse.grade;
  return (
    <RoundPort>
      <WordLevel word={word} wordGrade={wordGrade} />
      <GradePicker word={word} />
    </RoundPort>
  );
}
