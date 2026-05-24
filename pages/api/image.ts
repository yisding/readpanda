import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Data = {
  error?: string;
  url?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(405).send({ error: "Only POST requests allowed" });
    return;
  }

  const { word } = req.query;

  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt: `clip art of ${word}`,
    size: "256x256",
  });

  res.status(200).json({ url: response.data?.[0]?.url });
}
