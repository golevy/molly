import { useMutation } from "@tanstack/react-query";
import * as React from "react";
import { useToast } from "~/components/ui/use-toast";
import { INFINITE_QUERY_LIMIT } from "~/config/infinite-query";
import { api } from "~/trpc/react";

type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

// Creating a context for the chat application.
export const ChatContext = React.createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

interface Props {
  fileId: string;
  children: React.ReactNode;
}

// The provider component for the ChatContext.
export const ChatContextProvider = ({ fileId, children }: Props) => {
  const [message, setMessage] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Utility functions from trpc/react.
  const utils = api.useUtils();

  const { toast } = useToast();

  // Reference to store the previous message before mutation.
  const backupMessage = React.useRef("");

  const { mutate: sendMessage } = useMutation({
    // Function to execute during mutation, posting the message.
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({ fileId, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return response.body;
    },
    // Function to handle state before mutation starts.
    onMutate: async ({ message }) => {
      backupMessage.current = message;
      setMessage("");

      // Cancel any ongoing query to avoid race conditions.
      await utils.file.getFileMessages.cancel();

      // Get the current state of messages.
      const previousMessages = utils.file.getFileMessages.getInfiniteData();

      // Optimistically update the UI with the new message.
      utils.file.getFileMessages.setInfiniteData(
        {
          fileId,
          limit: INFINITE_QUERY_LIMIT,
        },
        (old) => {
          if (!old) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          let newPages = [...old.pages];

          let latestPage = newPages[0]!;

          // Add the new message to the latest page.
          latestPage.messages = [
            {
              createdAt: new Date(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
            },
            ...latestPage.messages,
          ];

          newPages[0] = latestPage;

          return {
            ...old,
            pages: newPages,
          };
        },
      );

      setIsLoading(true);

      // Return the previous messages for rollback in case of error.
      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },
    // Function to handle the response stream upon successful mutation.
    onSuccess: async (stream) => {
      setIsLoading(false);

      if (!stream) {
        return toast({
          title: "There was a problem sending this message",
          description: "Please refresh this page and try again",
          variant: "destructive",
        });
      }

      // Read the response stream.
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      // Accumulated response
      let accResponse = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);

        accResponse += chunkValue;

        // Append chunk to the actual message
        utils.file.getFileMessages.setInfiniteData(
          { fileId, limit: INFINITE_QUERY_LIMIT },
          (old) => {
            if (!old) return { pages: [], pageParams: [] };

            let isAiResponseCreated = old.pages.some((page) =>
              page.messages.some((message) => message.id === "ai-response"),
            );

            let updatedPages = old.pages.map((page) => {
              if (page === old.pages[0]) {
                let updatedMessages;

                if (!isAiResponseCreated) {
                  updatedMessages = [
                    {
                      createdAt: new Date(),
                      id: "ai-response",
                      text: accResponse,
                      isUserMessage: false,
                    },
                    ...page.messages,
                  ];
                } else {
                  updatedMessages = page.messages.map((message) => {
                    if (message.id === "ai-response") {
                      return {
                        ...message,
                        text: accResponse,
                      };
                    }
                    return message;
                  });
                }

                return {
                  ...page,
                  messages: updatedMessages,
                };
              }

              return page;
            });

            return { ...old, pages: updatedPages };
          },
        );
      }
    },
    // Function to handle errors during mutation.
    onError: (_, __, context) => {
      setMessage(backupMessage.current);
      // Reset the messages to the previous state in case of an error.
      utils.file.getFileMessages.setData(
        { fileId },
        { messages: context?.previousMessages ?? [], nextCursor: undefined },
      );
    },
    // Function executed when mutation is either successful or fails.
    onSettled: async () => {
      setIsLoading(false);

      // Invalidate the current file messages to refresh the data.
      await utils.file.getFileMessages.invalidate({ fileId });
    },
  });

  // Function to trigger the sendMessage mutation.
  const addMessage = () => sendMessage({ message });

  // Function to handle input changes in the textarea.
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  // Providing the context value to the children components.
  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
