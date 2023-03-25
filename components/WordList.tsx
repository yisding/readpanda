export default function WordList(props: { words: string[] }) {
  return (
    <div>
      {props.words.map((word) => (
        <button key={word}>{word}</button>
      ))}
    </div>
  );
}
