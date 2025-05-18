import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import { client } from '@repo/db/client';

const prisma = client.db;
export const posts = await prisma.post.findMany({}) as any;
   

export default async function Home() {
  return (
    <AppLayout>
      <Main posts={posts} />
    </AppLayout>
  );
}
