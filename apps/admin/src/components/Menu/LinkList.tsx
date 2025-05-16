import type { PropsWithChildren } from "react";

export function LinkList(props: PropsWithChildren<{ title: string }>) {
  return <div className="space-y-4">
    <h1>{props.title}</h1>
    {props.children}
  </div>;
}
