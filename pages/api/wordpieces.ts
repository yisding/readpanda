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

  messages = [
    {
      role: "system",
      content: `Split the given word into phoneme sequences no more than one syllable and 3 characters or less.
Do not output anything except JSON.
Use this format:

Word: basic
Output: [ { "phonemes": "beɪ", "characters": "ba" }, { "phoneme": "s", "characters": "s" }, { "phoneme": "ɪk", "characters": "ic" } ]

Word: back
Output: [ { "phonemes": "b", "characters": "b" }, { "phoneme": "æ", "characters": "a" }, { "phoneme": "k", "characters": "ck" } ]

Word: blizzard
Output: [ { "phonemes": "bli", "characters": "blɪ" }, { "phoneme": "z", "characters": "zz" }, { "phoneme": "ərd", "characters": "ard" } ]`,
    },
    {
      role: "user",
      content: `Word: ${word}
Output:`,
    },
  ];

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
