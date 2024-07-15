import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { getPineconeClient } from "~/lib/pinecone";

const MAX_CONCURRENCY = 20;

// Creating an instance of uploadthing
const f = createUploadthing();

export const ourFileRouter = {
  // File uploader handler, restricting to PDF files with a max size of 4MB
  fileUploader: f({ pdf: { maxFileSize: "128MB" } })
    // Middleware for handling request and user session validation
    .middleware(async ({ req }) => {
      // Retrieving user session
      const session = await getServerAuthSession();
      // Throwing an unauthorized error if no session or user ID is found
      if (!session || !session.user.id) throw new Error("Unauthorized");

      // Returning user ID
      return { userId: session.user.id };
    })
    // Logic to handle after file upload is complete
    .onUploadComplete(async ({ metadata, file }) => {
      // Creating a file record in the database
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          uploadStatus: "PROCESSING",
        },
      });

      try {
        // Fetching file data from the specified URL
        const response = await fetch(
          `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
        );

        // Getting the binary large object (Blob) of the file
        const blob = await response.blob();
        // Loading the PDF file using PDFLoader
        const loader = new PDFLoader(blob);
        // Loading page-level documents
        const pageLevelDocs = await loader.load();

        // Getting the number of pages
        const pagesAmt = pageLevelDocs.length;

        // Getting Pinecone client and index
        const pinecone = getPineconeClient();
        const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

        // Creating OpenAI embeddings
        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
          batchSize: 512, // Default value if omitted is 512. Max is 2048
        });

        // Using PineconeStore to create vectors and index from documents
        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          pineconeIndex,
          maxConcurrency: MAX_CONCURRENCY, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
          namespace: createdFile.id,
        });

        // Updating file upload status to success
        await db.file.update({
          data: {
            uploadStatus: "SUCCESS",
          },
          where: {
            id: createdFile.id,
          },
        });
      } catch (error) {
        console.log(error);
        // Updating file upload status to failed if there's an error during the process
        await db.file.update({
          data: {
            uploadStatus: "FAILED",
          },
          where: {
            id: createdFile.id,
          },
        });
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
