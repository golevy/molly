import { ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

const UpgradeButton = () => {
  const { mutateAsync: createStripeSession } =
    api.stripe.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        window.location.href = url ?? "/dashboard/billing";
      },
    });

  return (
    <Button
      onClick={async () => await createStripeSession()}
      className="w-full"
    >
      Upgrade now <ArrowRight className="ml-1.5 h-5 w-5" />
    </Button>
  );
};

export default UpgradeButton;
