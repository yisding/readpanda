import cx from "classnames";
import Link from "next/link";
import { ReactNode } from "react";

export default function BigRedButton(props: {
  children?: ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <Link
      className={cx(
        "text-white bg-panda text-2xl rounded-full p-4",
        props.className
      )}
      href={props.href}
    >
      {props.children}
    </Link>
  );
}
