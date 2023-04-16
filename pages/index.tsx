import Head from "next/head";
import Image from "next/image";

import WordHero from "@/components/WordHero";
import BigRedButton from "@/components/BigRedButton";
import BigRedLink from "@/components/BigRedLink";
import RoundPort from "@/components/RoundPort";
import { useRouter } from "next/router";
import { useRef } from "react";

export default function Home() {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Head>
        <title>ReadPanda</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <RoundPort>
        <div className="flex h-full w-full flex-col justify-center">
          <div className="my-8">
            <h1 className="text-center text-2xl font-bold text-panda lg:text-3xl">
              Welcome to ReadPanda!
            </h1>
            <p className="text-center text-2xl font-bold text-panda lg:text-3xl">
              {`Are you ready to learn some words?`}
            </p>
          </div>
          <div className="flex flex-col justify-center max-lg:items-center lg:flex-row">
            <Image
              src="/redpanda.png"
              width={221}
              height={232}
              alt="red panda sitting"
            />
            <div className="m-4 flex flex-col justify-between">
              <BigRedLink href="/grade">
                <span className="font-bold">I want to learn new words</span>
              </BigRedLink>
              <div className="h-4"></div>
              <BigRedButton
                onClick={() => {
                  // TODO replace with ref

                  const word = searchRef.current?.value;
                  if (!word) {
                    searchRef.current?.focus();
                  } else {
                    router.push(`/grade?word=${encodeURIComponent(word)}`);
                  }
                }}
              >
                <Image
                  src="/search.png"
                  width={64}
                  height={64}
                  alt="search"
                  className="inline h-8 w-8 lg:h-16 lg:w-16"
                />
                <input
                  ref={searchRef}
                  className="w-48 bg-panda font-bold placeholder-white focus:placeholder-opacity-0 focus:outline-none lg:w-96"
                  placeholder="Search for a word"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const word = e.currentTarget.value;

                      router.push(`/grade?word=${encodeURIComponent(word)}`);
                    }
                  }}
                ></input>
              </BigRedButton>
            </div>
          </div>
        </div>
      </RoundPort>
    </>
  );
}
