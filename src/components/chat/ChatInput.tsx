import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Send } from "lucide-react";

const ChatInput = ({ isDisabled }: { isDisabled?: boolean }) => {
  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="mx-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 md:flex-col">
          <div className="relative flex w-full flex-col p-4">
            <div className="relative">
              <Textarea
                rows={1}
                maxRows={4}
                autoFocus
                placeholder="Enter your question..."
                className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch resize-none py-3 pr-12 text-base"
              />

              <Button
                disabled={isDisabled}
                aria-label="send message"
                className="absolute bottom-1.5 right-[0.5rem]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
