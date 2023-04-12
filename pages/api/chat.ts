import { OpenAIStream } from "../../utils/OpenAIStream";

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const { messages } = (await req.json()) as {
    messages?: { role: string; content: string }[];
  };

  if (!messages) {
    return new Response("Missing messages", { status: 400 });
  }

  const systemMessage = `You are a helpful assistant who's here to help students learn. Today's date is ${new Date().toLocaleDateString()}.`;

  const payload = {
    model: "gpt-4",
    messages: [{ role: "system", content: systemMessage }, ...messages],
    max_tokens: 6000,
    temperature: 0.8,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
    n: 1,
    stream: true,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
