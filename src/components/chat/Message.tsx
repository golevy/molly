import * as React from "react";
import { cn } from "~/lib/utils";
import { ExtendedMessage } from "~/types/message"; // Type definition for messages
import { Icons } from "~/components/Icons";
import Markdown from "react-markdown"; // Markdown renderer
import { format } from "date-fns"; // Date formatting library

interface MessageProps {
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
}

// Message component definition using React.forwardRef
const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson }, ref) => {
    return (
      // Root div element of the component, ref is forwarded here
      <div
        ref={ref}
        className={cn("flex items-end", {
          "justify-end": message.isUserMessage, // Align right if it's a user message
        })}
      >
        {/* Avatar/icon container */}
        <div
          className={cn(
            "relative flex aspect-square h-6 w-6 items-center justify-center",
            {
              "order-2 rounded-sm bg-blue-600": message.isUserMessage, // Blue background for user message
              "order-1 rounded-sm bg-zinc-800": !message.isUserMessage, // Grey background for other messages
              invisible: isNextMessageSamePerson, // Hide if the next message is from the same person
            },
          )}
        >
          {/* User or logo icon based on the message source */}
          {message.isUserMessage ? (
            <Icons.user className="h-3/4 w-3/4 fill-zinc-200 text-zinc-200" />
          ) : (
            <Icons.logo className="h-3/4 w-3/4 fill-zinc-300" />
          )}
        </div>

        {/* Container for the message content */}
        <div
          className={cn("mx-2 flex max-w-md flex-col space-y-2 text-base", {
            "order-1 items-end": message.isUserMessage, // Align right for user message
            "order-2 items-start": !message.isUserMessage, // Align left for other messages
          })}
        >
          {/* Message bubble */}
          <div
            className={cn("inline-block rounded-lg px-4 py-2", {
              "bg-blue-600 text-white": message.isUserMessage, // Blue bubble for user message
              "bg-gray-200 text-gray-900": !message.isUserMessage, // Grey bubble for other messages
              "rounded-br-none":
                !isNextMessageSamePerson && message.isUserMessage, // No bottom-right round if next message is from the same user
              "rounded-bl-none":
                !isNextMessageSamePerson && !message.isUserMessage, // No bottom-left round if next message is from a different user
            })}
          >
            {/* Render message text or Markdown content */}
            {typeof message.text === "string" ? (
              <Markdown
                className={cn("prose", {
                  "text-zinc-50": message.isUserMessage, // Light text for user message
                })}
              >
                {message.text}
              </Markdown>
            ) : (
              message.text // JSX element if not a string
            )}
            {/* Display message time except for loading messages */}
            {message.id !== "loading-message" ? (
              <div
                className={cn("mt-2 w-full select-none text-right text-xs", {
                  "text-zinc-500": !message.isUserMessage, // Grey text for time of other messages
                  "text-blue-300": message.isUserMessage, // Blue text for time of user messages
                })}
              >
                {format(new Date(message.createdAt), "HH:mm")}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  },
);

export default Message;
