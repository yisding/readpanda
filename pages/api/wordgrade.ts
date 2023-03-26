// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

type Data = {
  error?: string;
  grade?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { word } = req.query;

  const prompt = `Use this format:

Word: <word>
Reading Grade JSON: <JSON with field \`grade\`>

Word: he
Reading Grade JSON: {"grade": "K"}

Word: ability
Reading Grade JSON: {"grade": "3"}

Word: instrument
Reading Grade JSON: {"grade": "6"}

Word: improbable
Reading Grade JSON: {"grade": "6"}

Word: ${word}
Reading Grade JSON:`;

  const { data } = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
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

  const responseData: { grade: string } = JSON.parse(responseJson);

  res.status(200).json(responseData);
}
