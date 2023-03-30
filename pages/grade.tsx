import { useRouter } from "next/router";
import useSWR from "swr";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import BigRedLink from "@/components/BigRedLink";
import RoundPort from "@/components/RoundPort";
import Header from "@/components/Header";
import Image from "next/image";
import { mapGradeToText } from "@/utils";

const fetcher = (input: RequestInfo | URL, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json());

function WordLevel(props: { word: string; wordGrade: string }) {
  return (
    <div className="text-3xl text-panda text-center font-bold">
      The word {props.word} is a {mapGradeToText(props.wordGrade)} word!
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
    <div className="my-4">
      <div className="my-4 flex flex-row items-center justify-center">
        <Image
          src="/pandawalk.png"
          alt="walking panda"
          height={200}
          width={200}
        />
        <h1 className="text-4xl text-panda text-center font-bold pt-16 pl-4">
          What grade are you in?
        </h1>
      </div>
      <div className="grid grid-cols-3 grid-rows-2 gap-4 font-bold my-8">
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
        <Header />
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
      <Header />
      <WordLevel word={word} wordGrade={wordGrade} />
      <GradePicker word={word} />
    </RoundPort>
  );
}
