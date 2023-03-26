import Link from "next/link";

export default function WordHero(props: {
  grade: string;
  word: string;
  pieces: { characters: string; phoneme: string }[];
}) {
  return (
    <div>
      <div className="flex flex-row">
        <h1 className="text-3xl font-bold">{props.word}</h1>
        <div className="flex flex-row">
          {props.pieces.map((piece) => (
            <Link
              key={piece.characters}
              className="flex flex-col border-red-500 border-solid border-2"
              href={`/wordpicker?grade=${props.grade}&word=${props.word}&phoneme=${piece.phoneme}&characters=${piece.characters}`}
            >
              <span>{piece.characters}</span>
              <span>{piece.phoneme}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
