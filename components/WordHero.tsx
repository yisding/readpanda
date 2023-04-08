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
      <div className="flex flex-col justify-center items-center h-full">
        <div className="flex flex-row justify-center items-center">
          <Image
            src={props.image}
            alt={props.word}
            height={256}
            width={256}
            className="mx-8"
            unoptimized
          />
          <div className="flex flex-col mx-8">
            <h1 className="font-bold text-panda text-6xl text-center">
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
                  height={100}
                  width={100}
                />
              </button>
              {props.pieces.map((piece) => (
                <Link
                  key={piece.characters}
                  className="flex flex-col border-solid border-2 text-panda text-4xl m-4"
                  href={`/wordpicker?grade=${props.grade}&word=${props.word}&phoneme=${piece.phonemes}&characters=${piece.characters}`}
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
