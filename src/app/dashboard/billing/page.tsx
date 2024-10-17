import BillingForm from "~/components/BillingForm";
import { getUserSubscriptionPlan } from "~/lib/stripe";

const billingPage = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <>
      <title>Molly | Billing</title>
      <BillingForm subscriptionPlan={subscriptionPlan} />
    </>
  );
};

export default billingPage;
