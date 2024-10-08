import { NextRequest, NextResponse } from "next/server";
import initStripe from "stripe";
import { supabaseRouteHandlerClient } from "@/app/utils/supabaseRouteHandlerClient";

export async function GET(
  req: NextRequest,
  { params }: { params: { priceId: string } }
) {
  const supabase = supabaseRouteHandlerClient();
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
    customer: stripeCustomerInfo?.stripe_customer!,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled`,
  });

  return NextResponse.json({ id: session.id });
}
