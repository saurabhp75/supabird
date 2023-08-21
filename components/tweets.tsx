"use client";

import Likes from "./likes";
import { useEffect, experimental_useOptimistic as useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {
  const [optimisticTweets, addOptimisticTweet] = useOptimistic<
    TweetWithAuthor[],
    TweetWithAuthor
  >(tweets, (currentOptimisticTweets, newTweet) => {
    const newOptimisticTweets = [...currentOptimisticTweets];
    const index = newOptimisticTweets.findIndex(
      (tweet) => tweet.id === newTweet.id
    );
    newOptimisticTweets[index] = newTweet;
    return newOptimisticTweets;
  });

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  // Subscribe to real-time updates on tweets table
  useEffect(() => {
    const channel = supabase
      .channel("realtime tweets")
      .on(
        "postgres_changes",
        {
          event: "*", // All events (insert, update, delete)
          schema: "public",
          table: "tweets",
        },
        (payload) => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return optimisticTweets.map((tweet) => (
    <div
      key={tweet.id}
      className="border border-gray-800 border-t-0 px-4 py-8 flex"
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <div className="h-12 w-12">
              <Image
                className="rounded-full"
                src={tweet.author.avatar_url}
                alt="tweet user avatar"
                width={48}
                height={48}
              />
            </div>
          </CardTitle>
          <CardDescription>
            @{tweet.author.username} {`${dayjs(tweet.created_at).fromNow()}`}
          </CardDescription>
        </CardHeader>
        <CardContent>{tweet.title}</CardContent>
        <CardFooter className="flex justify-between">
          <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
        </CardFooter>
      </Card>
    </div>
  ));
}
