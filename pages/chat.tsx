import { useState } from "react";

export default function Chat() {
  const [loading, setLoading] = useState(false);
  const [botResponse, setBotResponse] = useState("");

  const handleClick = async () => {
    setLoading(true);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "Hello, I'm here to help you with your tutoring today. Ask me any questions you would like.",
          },
          {
            role: "user",
            content:
              "Hi, I'm having trouble with my math homework. Can you help me?",
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      console.log(chunkValue);
      setBotResponse((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Chat</h1>
      <div>
        <button onClick={handleClick}>Try me!</button>
      </div>
      <div>{botResponse}</div>
    </div>
  );
}
