import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./auth-button-server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user not authenticated, redirect to login
  if (!session) {
    redirect("/login");
  }

  const { data: tweets } = await supabase
    .from("tweets")
    .select("*, profiles(*)");
  // We can grab colums frm related tables
  // from same schema, if RLS allows us

  return (
    <div>
      <AuthButtonServer />
      <pre>{JSON.stringify(tweets, null, 2)}</pre>
    </div>
  );
}
