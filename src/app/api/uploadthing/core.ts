import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

const f = createUploadthing();

export const ourFileRouter = {
  fileUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const session = await getServerAuthSession();
      if (!session || !session.user.id) throw new Error("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          uploadStatus: "PROCESSING",
        },
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
