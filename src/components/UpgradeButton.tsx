import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

const UpgradeButton = () => {
  const router = useRouter();

  // TODO: Integrate Payment Functionality
  // Here, the implementation of a payment process integration is needed. First, choose an appropriate payment service provider (e.g., Stripe, PayPal, etc.).
  // Then, follow the API documentation of the selected payment service to implement the payment process.
  // This might include creating a payment button, handling payment states, and setting up callbacks for successful or failed payments.
  // Ensure the security of the payment process and the protection of user data.

  return (
    <Button
      onClick={() => router.push("/dashboard/billing")}
      className="w-full"
    >
      Upgrade now <ArrowRight className="ml-1.5 h-5 w-5" />
    </Button>
  );
};

export default UpgradeButton;
