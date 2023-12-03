"use client"

import { api } from "~/trpc/react";
import { InfiniteTweetList } from "./InfiniteTweetList";

export function RecentTweets() {
    const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastpage) => lastpage.nextCursor,
      },
    );
    let t;
    if(tweets.hasNextPage !=undefined){
      t=tweets.hasNextPage
    }else{
      t=false
    }
    return <InfiniteTweetList tweets={tweets.data?.pages.flatMap((page)=> page.tweets)} isError={tweets.isError} isLoading={tweets.isLoading} hasMore={t} fetchNewTweets={tweets.fetchNextPage} />;
}