import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AuthButtonClient from "../auth-button-client";

async function Login() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is authenticated, redirect to landing page
  if (session) {
    redirect("/");
  }

  // Show login page/button as session is null
  return <AuthButtonClient session={session} />;
}

export default Login;
