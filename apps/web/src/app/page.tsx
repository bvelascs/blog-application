import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const posts = await prisma.post.findMany({}) as any;
   

export default async function Home() {
  return (
    <AppLayout>
      <Main posts={posts} />
    </AppLayout>
  );
}
