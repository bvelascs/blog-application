import type { PropsWithChildren } from "react";

export function LinkList(props: PropsWithChildren<{ title: string }>) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">{props.title}</h2>
      <div className="space-y-2">
        {props.children}
      </div>
    </div>
  );
}
