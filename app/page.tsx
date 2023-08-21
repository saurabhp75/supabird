import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NewTweet from "../components/new-tweet";
import Tweets from "../components/tweets";
import { ModeToggle } from "@/components/theme-switcher";
import AuthButtonClient from "../components/auth-button-client";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  // console.log(`location: ${location}`);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user not authenticated, redirect to login
  if (!session) {
    redirect("/login");
  }

  // We can grab colums from related tables from same
  // schema, if RLS allows us. Also, "profiles" has been
  // aliased to "author"
  const { data } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(user_id)")
    .order("created_at", {
      ascending: false,
    });

  // Transform tweet data
  const tweets =
    data?.map((tweet) => ({
      ...tweet,
      author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
      user_has_liked_tweet: !!tweet.likes.find(
        (like) => like.user_id === session.user.id
      ),
      likes: tweet.likes.length,
    })) ?? [];

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex justify-between px-4 py-6 border border-gray-800 border-t-0">
        <h1 className="text-xl font-bold">Home</h1>
        <AuthButtonClient session={session} />
        <ModeToggle />
      </div>
      <NewTweet user={session.user} />
      <Tweets tweets={tweets} />
    </div>
  );
}
