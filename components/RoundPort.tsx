import { ReactNode } from "react";

export default function RoundPort(props: { children?: ReactNode }) {
  return (
    <main className="w-full h-full flex justify-center items-center">
      <div className="fixed w-screen h-screen z-10 font-bold text-4xl text-panda flex justify-center items-center bg-white flex-col lg:hidden">
        <div className="text-center">Busy building support for mobile</div>
        <div className="text-center">Sowwy</div>
      </div>
      <div className="w-3/4 h-3/4 rounded-xl bg-gray-100 p-16">
        {props.children}
      </div>
    </main>
  );
}
