import { AppLayout } from "../../../components/Layout/AppLayout";
import { Main } from "../../../components/Main";
import { posts } from "@repo/db/data";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const postByTag = posts.filter(post => post.tags.toLowerCase().replace(" ", "-").includes(name));

  return (
    <AppLayout>
      <Main posts={postByTag} />
    </AppLayout>
  );
}
