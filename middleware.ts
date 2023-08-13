import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";


// Server components have read-only access to cookies
// Client components, route handlers, server actions
// and middleware can all set a cookie.
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  // Refresh the session if its expired
  await supabase.auth.getSession();
  return res;
}
