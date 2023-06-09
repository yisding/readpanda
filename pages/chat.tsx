import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import {
  Avatar,
  ChatContainer,
  ConversationHeader,
  Message,
  MessageInput,
  MessageList,
} from "@chatscope/chat-ui-kit-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const router = useRouter();
  const { word } = router.query;

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [initialSent, setInitialSent] = useState(false);

  const handleSend = useCallback(
    async (_innerHTML: string, _textContent: string, innerText: string) => {
      setLoading(true);

      const message: Message = { role: "user", content: innerText };
      const newMessages = [...messages, message];
      setMessages(newMessages);

      const response = await fetch("/api/yoda", {
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
    },
    [messages]
  );

  useEffect(() => {
    if (word && typeof word === "string" && !initialSent) {
      if (messages.length === 0) {
        handleSend("", "", word);
        setInitialSent(true);
      }
    }
  }, [handleSend, messages.length, word, initialSent]);

  return (
    <>
      <Head>
        <title>ReadPanda Chat</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex h-full w-full items-center justify-center">
        <main className="h-full w-full lg:h-5/6 lg:w-3/6">
          <ChatContainer className="text-3xl">
            <ConversationHeader>
              <Avatar src="/yoda-avatar.png" name="Yoda" />
              <ConversationHeader.Content
                userName="Yoda"
                info="Jedi, are you?"
              />
            </ConversationHeader>
            <MessageList>
              {messages.map((message, index) => (
                <Message
                  key={index}
                  model={{
                    message: message.content,
                    direction:
                      message.role === "user" ? "outgoing" : "incoming",
                    position: "single",
                  }}
                >
                  {message.role === "assistant" && (
                    <Avatar src="/yoda-avatar.png" name="Yoda" />
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
      </div>
    </>
  );
}
