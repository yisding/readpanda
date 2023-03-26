// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

type Data = { error?: string; words?: string[] };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { grade, phoneme, characters } = req.query;

  let messages: ChatCompletionRequestMessage[];

  if (phoneme && characters) {
    messages = [
      {
        role: "system",
        content: `Output only a JSON list of up to 9 words where this string of characters makes this phoneme sequence. Do not transpose the characters or phonemes.

Use this format:
Characters: dan
Phoneme: dæn
Reading Grade Level: 4
Output: ["dancer", "bandana", "dandelion", "dandruff", "dandy", "dangle", "dangling"]

Characters: tee
Phoneme: ti
Reading Grade Level: 4
Output: ["teeth", "teeter", "teetering", "teeter", "teeing", "committee", "teenager", "teepee", "goatee"]

Characters: y
Phoneme: i
Reading Grade Level: 1
Output: ["happy", "sorry", "lucky", "cheeky", "sappy", "daffy", "dizzy", "fizzy", "fuzzy"]

Characters: ck
Phoneme: k
Reading Grade Level: 1
Output: ["back", "pack", "rack", "tack", "duck", "sock", "rock", "lock", "pick"]`,
      },
      {
        role: "user",
        content: `Characters: ${characters}
Phoneme: ${phoneme}
Reading Grade Level: ${grade}
Output:`,
      },
    ];
  } else {
    messages = [
      {
        role: "system",
        content:
          "Output a JSON list of 9 new words at the appropriate reading grade level.",
      },
      {
        role: "user",
        content: `Reading Grade level: ${grade}
  Output:`,
      },
    ];
  }

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

  console.log(responseJson);

  if (!responseJson) {
    res.status(503).json({ error: "No response" });
    return;
  }

  const responseData: string[] = JSON.parse(responseJson);

  res.status(200).json({ words: responseData });
}
