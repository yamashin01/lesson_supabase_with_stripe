"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Button } from "../ui/button";

const SubscriptionButton = ({ planId }: { planId: string }) => {
  const processSubscription = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/subscription/${planId}`
    );

    const session = await res.json();

    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
    await stripe?.redirectToCheckout({ sessionId: session.id });
  };
  return (
    <Button onClick={async () => processSubscription()}>
      サブスクリプション契約する
    </Button>
  );
};

export default SubscriptionButton;
