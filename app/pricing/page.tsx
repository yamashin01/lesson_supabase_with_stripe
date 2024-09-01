import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Stripe from "stripe";
import initStripe from "stripe";

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

const PricingPage = async () => {
  const planInfoList = await getAllPlans();

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
            <Button>サブスクリプション契約する</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PricingPage;
