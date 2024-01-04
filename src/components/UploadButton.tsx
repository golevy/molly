import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button>Upload PDF</Button>
      </DialogTrigger>

      <DialogContent></DialogContent>
    </Dialog>
  );
};

export default UploadButton;
