import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database } from "@/lib/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import initStripe from "stripe";
import { cookies } from "@/node_modules/next/headers";
import SubscriptionButton from "@/components/checkout/SubscriptionButton";
import Link from "next/link";

interface Plan {
  id: string;
  name: string;
  price: string | null;
  interval: Stripe.Price.Recurring.Interval | null;
  currency: string;
}

const getAllPlans = async (): Promise<Plan[]> => {
  const stripe = new initStripe(process.env.STRIPE_SECRET_KEY!);
  const { data: plans } = await stripe.plans.list();

  const planInfoList = await Promise.all(
    plans.map(async (plan) => {
      const product = await stripe.products.retrieve(plan.product as string);

      return {
        id: plan.id,
        name: product.name,
        price: plan.amount_decimal,
        interval: plan.interval,
        currency: plan.currency,
      };
    })
  );

  const sortedPlanList = planInfoList.sort(
    (a, b) => parseInt(a.price!) - parseInt(b.price!)
  );

  return sortedPlanList;
};

const getProfileInfo = async (supabase: SupabaseClient<Database>) => {
  const { data: profile } = await supabase.from("profile").select("*").single();
  return profile;
};

const PricingPage = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: user } = await supabase.auth.getSession();
  const [planInfoList, profile] = await Promise.all([
    await getAllPlans(),
    await getProfileInfo(supabase),
  ]);

  const showSubscribeButton = !!user.session && !profile?.is_subscribed;
  const showCreateAcountButton = !user.session;
  const showManageSubscriptionButton = !!user.session && profile?.is_subscribed;

  return (
    <div className="w-full flex max-w-3xl mx-auto py-16 justify-around">
      {planInfoList.map((plan) => (
        <Card className="shadow-md" key={plan.id}>
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.interval}</CardDescription>
          </CardHeader>
          <CardContent>
            {plan.price}/{plan.interval}
          </CardContent>
          <CardFooter>
            <Button>
              {showSubscribeButton && <SubscriptionButton planId={plan.id} />}
              {showManageSubscriptionButton && (
                <Button>
                  <Link href="/dashboard">サブスクリプション管理する</Link>
                </Button>
              )}
              {showCreateAcountButton && "ログインする"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PricingPage;
