import { ArrowRight } from "lucide-react";
import * as React from "react";
import { Button } from "~/components/ui/button";

const UpgradeButton = () => {
  return (
    <Button onClick={() => {}} className="w-full">
      Upgrade now <ArrowRight className="ml-1.5 h-5 w-5" />
    </Button>
  );
};

export default UpgradeButton;
