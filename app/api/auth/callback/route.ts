import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // Get the user data
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Check if the user exists in the users table
      const { data: existingUser } = await supabase.from("users").select("*").eq("id", user.id).single()

      // If the user doesn't exist, create a new user record
      if (!existingUser) {
        await supabase.from("users").insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata.full_name || null,
          avatar_url: user.user_metadata.avatar_url || null,
        })
      }
    }
  }

  // Redirect to the dashboard
  return NextResponse.redirect(new URL("/dashboard", request.url))
}
