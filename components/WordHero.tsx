import Image from "next/image";
import Link from "next/link";

export default function WordHero(props: {
  grade: string;
  word: string;
  pieces: { characters: string; phoneme: string }[];
  image: string;
}) {
  return (
    <div className="m-8">
      <div className="flex flex-col justify-center items-center h-full">
        <div className="flex flex-row justify-center items-center">
          <Image
            src={props.image}
            alt="panda"
            height={256}
            width={256}
            className="mx-8"
          />
          <div className="flex flex-col mx-8">
            <h1 className="font-bold text-panda text-6xl text-center">
              {props.word}
            </h1>
            <div className="flex flex-row">
              {props.pieces.map((piece) => (
                <Link
                  key={piece.characters}
                  className="flex flex-col border-solid border-2 text-panda text-4xl m-4"
                  href={`/wordpicker?grade=${props.grade}&word=${props.word}&phoneme=${piece.phoneme}&characters=${piece.characters}`}
                >
                  <div>{piece.characters}</div>
                  <div>{piece.phoneme}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
