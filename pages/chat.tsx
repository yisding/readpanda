import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import { useState } from "react";
import {
  ChatContainer,
  Message,
  MessageList,
  MessageInput,
  ConversationHeader,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import Head from "next/head";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello, I'm Emma and I'm here to help you with your tutoring today. You can say things like "What's a red panda?", "I'd like to work on fractions" or "Let's practice fourth grade reading"`,
    },
  ]);

  const handleSend = async (
    innerHTML: string,
    textContent: string,
    innerText: string
  ) => {
    setLoading(true);

    const message: Message = { role: "user", content: innerText };
    const newMessages = [...messages, message];
    setMessages(newMessages);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: newMessages.slice(-8),
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

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
      setMessages((prev) => {
        let lastMessage = prev.at(-1);

        if (!lastMessage) {
          throw new Error("No message to append to.");
        }

        let newMessage = {
          ...lastMessage,
          content: lastMessage.content + chunkValue,
        };

        return [...prev.slice(0, -1), newMessage];
      });
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>ReadPanda Chat</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="h-full w-full">
        <ChatContainer>
          <ConversationHeader>
            <Avatar src="/emily-avatar.svg" name="Emma" />
            <ConversationHeader.Content
              userName="Emma"
              info="Powered by GPT-4"
            />
          </ConversationHeader>
          <MessageList>
            {messages.map((message, index) => (
              <Message
                key={index}
                model={{
                  message: message.content,
                  direction: message.role === "user" ? "outgoing" : "incoming",
                  position: "single",
                }}
              >
                {message.role === "assistant" && (
                  <Avatar src="/emily-avatar.svg" name="Emma" />
                )}
              </Message>
            ))}
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            attachButton={false}
            onSend={handleSend}
            sendDisabled={loading}
          />
        </ChatContainer>
      </main>
    </>
  );
}
