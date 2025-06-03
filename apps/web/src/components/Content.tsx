import type { PropsWithChildren } from "react";

export function Content({ children }: PropsWithChildren) {
  return <div className="w-full p-8 bg-white dark:bg-gray-900 min-h-screen">{children}</div>;
}
