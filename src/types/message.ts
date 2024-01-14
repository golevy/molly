import type { AppRouter } from "~/server/api/root";
import type { inferRouterOutputs } from "@trpc/server";

// Infer the RouterOutput type from the AppRouter.
// This type represents the output types of all the procedures in the AppRouter.
type RouterOutput = inferRouterOutputs<AppRouter>;

// Extract the 'messages' type from the 'getFileMessages' procedure within the 'file' router.
// This represents the structure of messages returned by the getFileMessages procedure.
type Messages = RouterOutput["file"]["getFileMessages"]["messages"];

// Define a type that omits the 'text' field from the message structure.
// This is used for creating a new message type that can have an extended 'text' field.
type OmitText = Omit<Messages[number], "text">;

// Define a type for extending the 'text' field of a message.
// This allows the 'text' field to be either a string or a JSX.Element.
type ExtendedText = {
  text: string | JSX.Element;
};

// Combine the OmitText and ExtendedText types to create a new message type.
// This type has all the properties of a message from the getFileMessages procedure, but with an extended 'text' field that can include JSX elements.
export type ExtendedMessage = OmitText & ExtendedText;

//* Using inferRouterOutputs from tRPC in your TypeScript code ensures automatic and consistent type alignment with your API.
//* This approach simplifies development, enhances type safety, and allows for flexible extension of data structures, such as with the ExtendedMessage type for diverse content rendering.
