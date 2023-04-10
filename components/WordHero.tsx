import Image from "next/image";
import Link from "next/link";
// @ts-ignore
import { useSpeechSynthesis } from "@readpanda/react-speech-kit";

export default function WordHero(props: {
  grade: string;
  word: string;
  pieces: { characters: string; phonemes: string }[];
  image: string;
}) {
  const { speak } = useSpeechSynthesis();

  return (
    <div className="m-8">
      <div className="flex h-full flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center lg:flex-row">
          <Image
            src={props.image}
            alt={props.word}
            height={256}
            width={256}
            className="mx-8 h-56 w-56 lg:h-64 lg:w-64"
            unoptimized
          />
          <div className="mx-4 flex flex-col lg:mx-8">
            <h1 className="my-2 text-center text-3xl font-bold text-panda lg:my-0 lg:text-6xl">
              {props.word}
            </h1>
            <div className="flex flex-row">
              <button
                onClick={() => {
                  speak({ text: props.word, rate: 0.5 });
                }}
              >
                <Image
                  src="/playsound.png"
                  alt="play sound"
                  height={96}
                  width={96}
                  className="h-16 w-16 lg:h-24 lg:w-24"
                />
              </button>
              {props.pieces.map((piece) => (
                <Link
                  key={piece.characters}
                  className="m-2 flex flex-col border-2 border-solid text-2xl text-panda lg:m-4 lg:text-4xl"
                  href={`/wordpicker?grade=${props.grade}&word=${props.word}&phonemes=${piece.phonemes}&characters=${piece.characters}`}
                >
                  <div>{piece.characters}</div>
                  <div>{piece.phonemes}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
