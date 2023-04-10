import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex flex-row items-center">
      <Image
        src="/redpanda.png"
        alt="logo"
        height={80}
        width={80}
        className="h-12 w-12 lg:h-20 lg:w-20"
      />
      <div className="mx-2 text-2xl font-bold text-panda lg:mx-4 lg:text-4xl">
        <Link href="/">Home</Link>
      </div>
    </div>
  );
}
