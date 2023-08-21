"use client";

import {
  type Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";


export default function AuthButtonClient({
  session,
}: {
  session: Session | null;
}) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const handleSignIn = async () => {
    // console.log("SignIn clicked");
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    // console.log("SignOut clicked");
    await supabase.auth.signOut();
    // Hide the protected tweets
    router.refresh();
  };

  return session ? (
    <Button  onClick={handleSignOut}>
      Logout
    </Button>
  ) : (
    <Button  onClick={handleSignIn}>
      Login
    </Button>
  );
}
