import { PineconeStore } from "@langchain/community/vectorstores/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import type { NextRequest } from "next/server";
import { openai } from "~/lib/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { getPineconeClient } from "~/lib/pinecone";
import { SendMessageValidator } from "~/lib/validators/SendMessageValidator";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

// The main function to handle POST requests.
export const POST = async (req: NextRequest) => {
  // Parsing the JSON body of the request.
  const body = await req.json();

  // Retrieving user session for authentication.
  const session = await getServerAuthSession();
  const userId = session?.user.id;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Validating the message and extracting necessary information.
  const { fileId, message } = SendMessageValidator.parse(body);

  // Retrieving the file associated with the user.
  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  });

  if (!file) {
    return new Response("Not Found", { status: 404 });
  }

  // Creating a new message record in the database.
  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId,
    },
  });

  // Preparing for vector-based message processing.
  // Initializing OpenAI embeddings and Pinecone client.
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const pinecone = getPineconeClient();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

  // Creating a vector store using the Pinecone index and the file ID as namespace.
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: file.id,
  });

  // Performing a similarity search on the user's message.
  const results = await vectorStore.similaritySearch(message, 4);

  // Retrieving previous messages for context.
  const prevMessages = await db.message.findMany({
    where: {
      fileId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 6,
  });

  // Formatting the previous messages for input to the AI model.
  const formattedPrevMessages = prevMessages.map((msg) => ({
    role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: msg.text,
  }));

  // Creating a chat completion request to the OpenAI API.
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0,
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format.",
      },
      // User input and context for the AI model.
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedPrevMessages.map((message) => {
    if (message.role === "user") return `User: ${message.content}\n`;
    return `Assistant: ${message.content}\n`;
  })}
  
  \n----------------\n
  
  CONTEXT:
  ${results.map((r) => r.pageContent).join("\n\n")}
  
  USER INPUT: ${message}`,
      },
    ],
  });

  // Handling the streaming response from OpenAI.
  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      // Saving the AI-generated response to the database.
      await db.message.create({
        data: {
          text: completion,
          isUserMessage: false,
          fileId,
          userId,
        },
      });
    },
  });

  // Returning the streaming text response to the client.
  return new StreamingTextResponse(stream);
};
