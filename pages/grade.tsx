import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import BigRedLink from "@/components/BigRedLink";
import RoundPort from "@/components/RoundPort";
import Header from "@/components/Header";
import Image from "next/image";
import { mapGradeToText } from "@/utils/text";

const fetcher = (input: RequestInfo | URL, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json());

function WordLevel(props: { word: string; wordGrade: string }) {
  return (
    <div className="text-center text-3xl font-bold text-panda">
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
      <div className="my-4 flex flex-col items-center justify-center lg:flex-row">
        <Image
          src="/pandawalk.png"
          alt="walking panda"
          height={208}
          width={208}
          className="h-32 w-32 lg:h-40 lg:w-40 xl:h-52 xl:w-52"
        />
        <h1 className="pl-4 text-center text-2xl font-bold text-panda lg:pt-16 lg:text-4xl">
          What grade are you in?
        </h1>
      </div>
      <div className="my-8 grid grid-cols-2 grid-rows-3 gap-3 font-bold lg:grid-cols-3 lg:grid-rows-2 lg:gap-4">
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

  const { data: wordGradeResponse, error: wordGradeError } = useSWRImmutable(
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
