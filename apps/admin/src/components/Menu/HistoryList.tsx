import { history } from "../../functions/history";
import { type Post } from "@repo/db/data";
import Link from "next/link";
import { LinkList } from "./LinkList";

const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export async function HistoryList({
  posts,
}: {
  posts: Post[];
}) {
  const historyItems = history(posts);

  return (
    <LinkList title="History">
      {historyItems.map((item: { month: number, year: number, count: number }, index) => {
        const { month, year, count } = item;
        const monthAndYear = new Date(year, month).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });

        return (
          <div key={index} className="px-3">
            <Link
              title={`History / ${months[month+1]}, ${year}`}
              className="flex space-x-2 hover:cursor-pointer hover:text-blue-700"
              href={`/history/${year}/${month+1}`}
            >
              <span
                data-test-id="post-count"
                className="flex h-7 w-7 items-center justify-center rounded-md border-[0.5px] border-gray-400"
              >
                {count}
              </span>
              <span>{monthAndYear}</span>

            </Link>
          </div>
        );
      })}
    </LinkList>
  );
}
