export default function WordHero(props: {
  word: string;
  pieces: { characters: string; phoneme: string }[];
}) {
  return (
    <div>
      <div className="flex flex-row">
        <h1 className="text-3xl font-bold">{props.word}</h1>
        <div className="flex flex-row">
          {props.pieces.map((piece) => (
            <button
              key={piece.characters}
              className="flex flex-col border-red-500 border-solid border-2"
            >
              <span>{piece.characters}</span>
              <span>{piece.phoneme}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
