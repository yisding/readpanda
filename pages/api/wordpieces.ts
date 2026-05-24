import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const model = process.env.OPENAI_MODEL ?? "gpt-5.5";

type Data = {
  error?: string;
  pieces?: { characters: string; phonemes: string }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { word, grade } = req.query;

  let instructions: string;

  if (grade === "K") {
    instructions = `Split the given word into phoneme sequences and its corresponding characters.
      Split the word into individual letters.
      The character letters should add up to the original word. Each character should sound like the phoneme.
Do not output anything except JSON.
Use this format:

Word: basic
Output: [ { "phonemes": "b", "characters": "b" }, { "phonemes": "eɪ", "characters": "a" }, { "phonemes": "s", "characters": "s" }, { "phonemes": "ɪ", "characters": "i" }, { "phonemes": "k", "characters": "c" } ]

Word: hat
Output: [ { "phonemes": "h", "characters": "h" }, { "phonemes": "æ", "characters": "a" }, { "phonemes": "t", "characters": "t" } ]

Word: pig
Output:  [ { "phonemes": "p", "characters": "p" }, { "phonemes": "ɪ", characters: "i" }, { "phonemes": "g", "characters": "g" } ]

Word: blue
Output:  [ { "phonemes": "b", "characters": "b" }, { "phonemes": "l", characters: "l" }, { "phonemes": "u:", "characters": "ue" } ]

Word: happy
Output:  [ { "phonemes": "h", "characters": "h" }, { "phonemes": "æ", characters: "a" }, { "phonemes": "p", "characters": "pp" },{ "phonemes": "i", "characters": "y" } ]`;
  } else {
    instructions = `Split the given word into phoneme sequences and its corresponding characters.
The character letters should add up to the given word.
If a given word only has 5 or less letters, split it into sequences of 3 or less characters.
Each character sequence should sound like the phoneme sequence.
Do not output anything except JSON.
Use this format:

Word: basic
Output: [ { "phonemes": "beɪ", "characters": "ba" }, { "phonemes": "si", "characters": "sɪ" }, { "phonemes": "k", "characters": "c" } ]

Word: wonderful
Output: [ { "phonemes": "wʌn", "characters": "won" }, { "phonemes": "dər", "characters": "der" }, { "phonemes": "fəl", "characters": "ful" } ]

Word: cheerful
Output: [ { "phonemes": "tʃɪr", "characters": "cheer" }, { "phonemes": "fəl", "characters": "ful" } ]

Word: jump
Output: [ { "phonemes": "dʒ", "characters": "j" }, { "phonemes": "ʌmp", "characters": "ump" } ]

Word: silly
Output:[ { "phonemes": "sɪ", "characters": "si" }, { "phonemes": "li", "characters": "lly" } ]

Word: sign
Output:[ { "phonemes": "s", "characters": "s" }, { "phonemes": "igh", "characters": "aɪ" } ]

Word: play
Output:[ { "phonemes": "p", "characters": "p" }, { "phonemes": "leɪ", "characters": "lay" } ]

Word: friend
Output:[ { "phonemes": "fr", "characters": "fr" }, { "phonemes": "ɛnd", "characters": "iend" } ]

Word: laugh
Output: [ { "phonemes": "læ", "characters": "lau" }, { "phonemes": "f", "characters": "gh" } ]`;
  }

  const response = await openai.responses.create({
    model,
    instructions,
    input: `Word: ${word}\nOutput:`,
    max_output_tokens: 1000,
    temperature: 0.1,
    text: {
      format: {
        type: "json_schema",
        name: "word_pieces",
        schema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              phonemes: { type: "string" },
              characters: { type: "string" },
            },
            required: ["phonemes", "characters"],
            additionalProperties: false,
          },
        },
      },
    },
  });

  const responseJson = response.output_text;

  if (!responseJson) {
    res.status(503).json({ error: "No response" });
    return;
  }

  const responseData: { characters: string; phonemes: string }[] =
    JSON.parse(responseJson);

  res.status(200).json({ pieces: responseData });
}
