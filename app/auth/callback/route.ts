import { NextRequest, NextResponse } from "next/server";
import { supabaseRouteHandlerClient } from "@/app/utils/supabaseRouteHandlerClient";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = supabaseRouteHandlerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(requestUrl.origin);
}
