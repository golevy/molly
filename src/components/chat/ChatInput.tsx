import * as React from "react";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Send } from "lucide-react";
import { ChatContext } from "~/components/chat/ChatContext";

const ChatInput = ({ isDisabled }: { isDisabled?: boolean }) => {
  const { addMessage, handleInputChange, isLoading, message } =
    React.useContext(ChatContext);

  // useRef hook to get direct access to the textarea DOM element.
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="mx-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 md:flex-col">
          <div className="relative flex w-full flex-col p-4">
            <div className="relative">
              <Textarea
                rows={1}
                maxRows={4}
                ref={textareaRef} // Assigning the ref to the textarea.
                autoFocus // Automatically focus the textarea when the component mounts.
                value={message}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  // Handling the Enter key press event.
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // Prevent the default action of the Enter key in a textarea(insert a new line).
                    addMessage();
                    textareaRef.current?.focus(); // Refocus on the textarea after sending the message.
                  }
                }}
                placeholder="Enter your question..."
                className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch resize-none py-3 pr-12 text-base"
              />

              <Button
                disabled={isDisabled || isLoading}
                aria-label="send message"
                onClick={() => {
                  addMessage();
                  textareaRef.current?.focus(); // Refocus on the textarea after sending the message.
                }}
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
