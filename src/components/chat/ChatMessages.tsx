import { Loader2, MessageSquare } from "lucide-react";
import { INFINITE_QUERY_LIMIT } from "~/config/infinite-query";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import Message from "~/components/chat/Message";
import Skeleton from "react-loading-skeleton";
import { useContext } from "react";
import { ChatContext } from "~/components/chat/ChatContext";

const ChatMessages = ({ fileId }: { fileId: string }) => {
  const { isLoading: isAiThinking } = useContext(ChatContext);

  // Using the TRPC infinite query hook to fetch messages for the file
  const { data, isLoading, fetchNextPage } =
    api.file.getFileMessages.useInfiniteQuery(
      {
        fileId,
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor, // Function to get the next page parameter
        keepPreviousData: true, // Option to keep previous data while new data is loading
      },
    );

  // Merging all pages of messages into a single array using flatMap
  // TODO: Learn flatMap()
  const messages = data?.pages.flatMap((page) => page.messages);

  // Defining a loading message
  const loadingMessage = {
    createdAt: new Date(),
    id: "loading-message",
    isUserMessage: false,
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
  };

  // Combining the loading message with actual messages
  const combinedMessages = [
    ...(isAiThinking ? [loadingMessage] : []), // Always display the loading message
    ...(messages ?? []), // Display messages if available
  ];

  return (
    <div
      className={cn(
        "flex flex-1 flex-col-reverse gap-4",
        "max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 p-3",
        "scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrollbar-touch overflow-y-auto scrollbar-thumb-blue-50",
      )}
    >
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message, i) => {
          const isNextMessageSamePerson =
            combinedMessages[i - 1]?.isUserMessage ===
            combinedMessages[i]?.isUserMessage;

          if (i === combinedMessages.length - 1) {
            return (
              <Message
                key={message.id}
                message={message}
                isNextMessageSamePerson={isNextMessageSamePerson}
              />
            );
          } else {
            return (
              <Message
                key={message.id}
                message={message}
                isNextMessageSamePerson={isNextMessageSamePerson}
              />
            );
          }
        })
      ) : isLoading ? (
        <div className="flex w-full flex-col gap-2">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <MessageSquare className="h-8 w-8 text-blue-500" />
          <h3 className="text-xl font-semibold">You&apos;re all set!</h3>
          <p className="text-sm text-zinc-500">
            Ask you first question to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
