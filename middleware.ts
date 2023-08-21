import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

// Server components have read-only access to cookies
// Client components, route handlers, server actions
// and middleware can all set a cookie.
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient<Database>({ req, res });

  //   const {
  //     data: { user },
  //   } = await supabase.auth.getUser();

  // if user is signed in and the current path is / (login-page) redirect the user to /account
  //   if (user && req.nextUrl.pathname === "/") {
  //     return NextResponse.redirect(new URL("/account", req.url));
  //   }

  // if user is not signed in and the current path is not / (login-page)
  // redirect the user to / (login - page)
  //   if (!user && req.nextUrl.pathname !== "/") {
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }

  // Refresh the session if its expired
  await supabase.auth.getSession();

  return res;
}
