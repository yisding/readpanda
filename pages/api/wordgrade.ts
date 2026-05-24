import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const model = process.env.OPENAI_MODEL ?? "gpt-5.5";

type Data = {
  error?: string;
  grade?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { word } = req.query;

  const instructions = `Use this format:

Word: <word>
Reading Grade JSON: <JSON with field \`grade\`>

Word: he
Reading Grade JSON: {"grade": "K"}

Word: ability
Reading Grade JSON: {"grade": "3"}

Word: instrument
Reading Grade JSON: {"grade": "6"}

Word: improbable
Reading Grade JSON: {"grade": "6"}`;

  const response = await openai.responses.create({
    model,
    instructions,
    input: `Word: ${word}\nReading Grade JSON:`,
    max_output_tokens: 200,
    temperature: 0.1,
    text: {
      format: {
        type: "json_schema",
        name: "reading_grade",
        schema: {
          type: "object",
          properties: {
            grade: { type: "string" },
          },
          required: ["grade"],
          additionalProperties: false,
        },
      },
    },
  });

  const responseJson = response.output_text;

  if (!responseJson) {
    res.status(503).json({ error: "No response" });
    return;
  }

  const responseData: { grade: string } = JSON.parse(responseJson);

  res.status(200).json(responseData);
}
