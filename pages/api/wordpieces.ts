import type { NextApiRequest, NextApiResponse } from "next";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

type Data = {
  error?: string;
  pieces?: { characters: string; phoneme: string }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { word, grade } = req.query;

  let messages: ChatCompletionRequestMessage[];

  if (grade === 'K') {
    messages = [
      {
        role: "system",
        content: `Split the given word into phoneme sequences and its corresponding characters. 
      Split the word into individual letters. 
      The character letters should add up to the original word. The character should sound like the phoneme.
Do not output anything except JSON.
Use this format:

Word: basic
Output: [ { "phonemes": "b", "characters": "b" }, { "phonemes": "eɪ", "characters": "a" }, { "phonemes": "s", "characters": "s" }, { "phonemes": "ɪ", "characters": "i" }, { phoneme: "k", "characters": "c" } ]

Word: hat
Output: [ { "phonemes": "h", "characters": "h" }, { "phonemes": "æ", "characters": "a" }, { "phonemes": "t", "characters": "t" } ]

Word: pig 

Output:  [ { "phonemes": "p", characters: "p" }, { "phonemes": "ɪ", characters: "i" }, { "phonemes": "g", characters: "g" } ]
`,
      },
      {
        role: "user",
        content: `Word: ${word}
Output:`,
      },
    ];
  } else {
    messages = [
      {
        role: "system",
        content: `SSplit the given word into phoneme sequences and its corresponding characters. The character letters should add up to the given word. 
      Do not output anything except JSON.
Use this format:

Word: basic
Output: [ { "phonemes": "beɪ", "characters": "ba" }, { "phonemes": "si", "characters": "sɪ" }, { "phonemes": "k", "characters": "c" } ]

Word: wonderful
Output: [ { "phonemes": "wʌn", "characters": "won" }, { "phonemes": "dər", "characters": "der" }, { "phonemes": "fəl", "characters": "ful" } ]

Word: cheerful
Output: [ { "phoneme: "tʃɪr", characters: "cheer" }, { phoneme: "fəl", characters: "ful" } ]
      `,
      },
      {
        role: "user",
        content: `Word: ${word}
Output:`,
      },
    ];
  };

  const { data } = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
    max_tokens: 1000,
    temperature: 0.1,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
    n: 1,
    stream: false,
  });

  const responseJson = data.choices[0].message?.content;

  if (!responseJson) {
    res.status(503).json({ error: "No response" });
    return;
  }

  const responseData: { characters: string; phoneme: string }[] =
    JSON.parse(responseJson);

  res.status(200).json({ pieces: responseData });
}
