import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import initStripe from "stripe";

export async function GET(
  req: NextRequest,
  { params }: { params: { priceId: string } }
) {
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
  const priceId = params.priceId;

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerInfo?.stripe_customer,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: "http://localhost:3000/payment/success",
    cancel_url: "http://localhost:3000/payment/cancelled",
  });

  return NextResponse.json({ id: session.id });
}
