import { ReactNode } from "react";

export default function RoundPort(props: { children?: ReactNode }) {
  return (
    <main className="w-full h-full flex justify-center items-center">
      <div className="w-3/4 h-3/4 p-8 rounded-xl bg-gray-100">
        {props.children}
      </div>
    </main>
  );
}
