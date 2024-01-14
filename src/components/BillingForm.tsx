"use client";

import MaxWidthWrapper from "~/components/MaxWidthWrapper";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

interface BillingFormProps {
  subscriptionPlan: any;
}

const BillingForm = ({ subscriptionPlan }: BillingFormProps) => {
  const router = useRouter();

  return (
    <MaxWidthWrapper className="max-w-5xl">
      <form
        className="mt-12"
        onSubmit={(e) => {
          // * Prevent the default form submit action
          // * This is used to stop the page from refreshing upon form submission
          e.preventDefault();
          router.push("/dashboard");
        }}
      >
        <Card>
          <CardHeader className="select-none">
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription className="cursor-pointer">
              You are currently on the <strong>{subscriptionPlan.name}</strong>
              &nbsp;plan.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
            <Button type="submit">Upgrade to PRO</Button>
          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  );
};

export default BillingForm;
