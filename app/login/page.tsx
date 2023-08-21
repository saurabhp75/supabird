import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import GitHubButton from "./github-button";
import LoginPage from "./login";

export const dynamic = "force-dynamic";

async function Login() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is authenticated, redirect to landing page
  if (session) {
    redirect("/");
  }

  // Show login page/button as session is null
  return (
    <div className="flex-1 flex justify-center items-center">
      <LoginPage />
    </div>
  );
}

export default Login;
