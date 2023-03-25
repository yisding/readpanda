import cx from "classnames";
import { ReactNode } from "react";

export default function BigRedButton(props: {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      className={cx(
        "text-white bg-panda text-2xl rounded-full p-4",
        props.className
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
