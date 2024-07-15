import { Pinecone } from "@pinecone-database/pinecone";

export const getPineconeClient = () => {
  const pinecone = new Pinecone();

  return pinecone;
};
