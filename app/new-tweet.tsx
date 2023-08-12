import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export default function NewTweet() {
  const AddTweet = async (formData: FormData) => {
    "use server";
    // console.log("Submitted");
    const title = String(formData.get("title"));
    const supabase = createServerActionClient<Database>({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("tweets").insert({ title, user_id: user?.id });
      revalidatePath("/");
    }
  };

  return (
    <form action={AddTweet}>
      <input name="title" className="bg-inherit" />
    </form>
  );
}
