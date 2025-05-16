import Link from "next/link";
import { JSX } from "react";

export function SummaryItem({
  name,
  link,
  count,
  isSelected,
  title,
}: {
  name: string;
  link: string;
  count: number;
  isSelected: boolean;
  title?: string;
}) {
  // TODO: Implement the summary item
  // must show the number of posts in that category and the name
  // if if is selected it must show in different color/background
  const className = "flex hover:cursor-pointer hover:text-blue-700";
  return (
    <div className={isSelected ? "selected " + className : className} >
      <Link title={`Category / ${title}`} href={link}>{title}</Link>
    </div>
  );
}