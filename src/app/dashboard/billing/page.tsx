import BillingForm from "~/components/BillingForm";

const subscriptionPlan = {
  name: "Pro",
};

const billingPage = () => {
  return (
    <>
      <title>Molly | Billing</title>
      <BillingForm subscriptionPlan={subscriptionPlan} />
    </>
  );
};

export default billingPage;
