import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import initStripe from "stripe";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    return NextResponse.json("UnAuthorized", { status: 401 });
  }

  const { data: stripeCustomerInfo } = await supabase
    .from("profile")
    .select("stripe_customer")
    .eq("id", user?.id)
    .single();

  const stripe = new initStripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerInfo?.stripe_customer,
    return_url: "http://localhost:3000/dashboard",
  });

  return NextResponse.json({ url: session.url });
}
