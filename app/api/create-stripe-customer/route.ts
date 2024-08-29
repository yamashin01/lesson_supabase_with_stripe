import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import initiStripe from "stripe";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  const data = await req.json();
  const { id, email } = data;

  const stripe = new initiStripe(process.env.STRIPE_SECRET_KEY!);
  const customer = await stripe.customers.create({
    email,
  });

  await supabase
    .from("profile")
    .update({ stripe_customer: customer.id })
    .eq("id", id);

  return NextResponse.json({
    message: `stripe customer created: ${customer.id}`,
  });
}
