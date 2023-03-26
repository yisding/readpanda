import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex flex-row items-center">
      <Image src="/redpanda.png" alt="logo" height={83} width={79} />
      <div className="text-panda mx-4 text-4xl font-bold">
        <Link href="/">Home</Link>
      </div>
    </div>
  );
}
