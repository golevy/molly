import { Dialog, DialogContent } from "~/components/ui/dialog";
import { DialogProps } from "@radix-ui/react-dialog";
import AuthForm from "~/components/auth/AuthForm";

const AuthDialog = ({ open, onOpenChange }: DialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col sm:max-w-[26rem]">
        <AuthForm />
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
