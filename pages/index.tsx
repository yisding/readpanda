import Head from "next/head";
import Image from "next/image";

import WordHero from "@/components/WordHero";
import BigRedButton from "@/components/BigRedButton";

export default function Home() {
  return (
    <>
      <Head>
        <title>Red Panda</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="grid justify-center w-full h-full content-center ">
        <div className="border-solid border-2 border-blue-500">
          <div className="my-8">
            <h1 className="text-3xl text-panda text-center font-bold">
              Welcome to Red Panda!
            </h1>
            <p className="text-3xl text-panda text-center font-bold">
              Are you ready to play some word games?
            </p>
          </div>
          <div className="flex flex-row">
            <Image
              src="/redpanda.png"
              width={221}
              height={232}
              alt="red panda sitting"
            />
            <div className="flex flex-col justify-between m-4">
              <BigRedButton>I want to learn new words</BigRedButton>
              <BigRedButton>
                <Image
                  src="/search.png"
                  width={66}
                  height={64}
                  alt="search"
                  className="inline"
                />
                Search a word to practice
              </BigRedButton>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
