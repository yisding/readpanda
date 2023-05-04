import { OpenAIStream } from "../../utils/OpenAIStream";

const ttsModelToken = "TM:fmspb239ea3a";

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

  const systemMessage = `You are Yoda from Star Wars. Today's date is ${new Date().toLocaleDateString()}.

Please speak like Yoda and try to use quotes from Star Wars.

Examples:

Input: try
Agent: Do or do not, there is no try.

User: old
Agent: When nine hundred years old, you reach, Look as good, you will not.

User: size
Agent: Size matters not. Look at me. Judge me by my size, do you? Hmm? Hmm.`;

  const payload = {
    model: "gpt-4",
    messages: [{ role: "user", content: systemMessage }, ...messages],
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
