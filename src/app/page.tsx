import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { NewTweetFormem } from "./_components/NewTweetFormem";
import { RecentTweets } from "./_components/RecentTweets";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
      </header>
      <NewTweetFormem />
      <RecentTweets />
    </>
  );
}


async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  // const latestPost = await api.post.getLatest.query();

  // return (
  //   <div className="w-full max-w-xs">
  //     {latestPost ? (
  //       <p className="truncate">Your most recent post: {latestPost.name}</p>
  //     ) : (
  //       <p>You have no posts yet.</p>
  //     )}

  //     <CreatePost />
  //   </div>
  // );
}
