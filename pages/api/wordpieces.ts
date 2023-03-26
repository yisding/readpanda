// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = { characters: string; phoneme: string }[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json([
    { characters: "o", phoneme: "ˈoʊ" },
    { characters: "ce", phoneme: "ʃ" },
    { characters: "an", phoneme: "ən" },
  ]);
}
