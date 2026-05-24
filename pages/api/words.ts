import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const model = process.env.OPENAI_MODEL ?? "gpt-5.5";

type Data = { error?: string; words?: string[] };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { grade, phonemes, characters } = req.query;

  let phonemeSequence = phonemes;
  if (phonemes === "") {
    phonemeSequence = "<silent>";
  }

  let instructions: string;
  let input: string;

  if (phonemeSequence && characters) {
    instructions = `Output only a JSON list of up to 9 words where this string of characters makes this phoneme sequence. Do not transpose the characters or phonemes.
Output only JSON.

Use this format:
Characters: dan
Phonemes: dæn
Reading Grade Level: 4
Output: ["dancer", "bandana", "dandelion", "dandruff", "dandy", "dangle", "dangling"]

Characters: tee
Phonemes: ti
Reading Grade Level: 4
Output: ["teeth", "teeter", "teetering", "teeter", "teeing", "committee", "teenager", "teepee", "goatee"]

Characters: y
Phonemes: i
Reading Grade Level: 1
Output: ["happy", "sorry", "lucky", "cheeky", "sappy", "daffy", "dizzy", "fizzy", "fuzzy"]

Characters: ck
Phonemes: k
Reading Grade Level: 1
Output: ["back", "pack", "rack", "tack", "duck", "sock", "rock", "lock", "pick"]

Characters: e
Phonemes: <silent>
Reading Grade Level: 5
Output: ["inspire", "voyage", "acquire", "conclave", "expanse", "forsake", "intrigue", "migrate", "subdue"]

Characters: k
Phonemes: <silent>
Reading Grade Level: 1
Output: ["knee", "knob", "knock", "knit", "knot", "know", "knight", "kneel", "known"]`;

    input = `Characters: ${characters}
Phonemes: ${phonemeSequence}
Reading Grade Level: ${grade}
Output:`;
  } else {
    instructions = `Output a JSON list of 9 new words at the appropriate reading grade level.

Use this format:

Reading Grade Level: K
Output: ["a", "the", ...]

Reading Grade Level: 1
Output: ["purple", "sorry", ...]

Reading Grade Level: 3,
Output: ["balloon", "riding", ...]

Reading Grade Level: 11
Output: ["undulate", "articulate", ...]
`;

    input = `Reading Grade Level: ${grade}
  Output:`;
  }

  const response = await openai.responses.create({
    model,
    instructions,
    input,
    max_output_tokens: 1000,
    temperature: 0.5,
    text: {
      format: {
        type: "json_schema",
        name: "word_list",
        schema: {
          type: "array",
          maxItems: 9,
          items: { type: "string" },
        },
      },
    },
  });

  const responseJson = response.output_text;

  if (!responseJson) {
    res.status(503).json({ error: "No response" });
    return;
  }

  const responseData: string[] = JSON.parse(responseJson);

  res.status(200).json({ words: responseData });
}
