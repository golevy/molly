import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { INFINITE_QUERY_LIMIT } from "~/config/infinite-query";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const fileRouter = createTRPCRouter({
  fetchAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.file.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),

  fetchFile: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const file = await ctx.db.file.findFirst({
        where: {
          id,
        },
      });

      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return file;
    }),

  deleteFile: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const file = await ctx.db.file.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.db.file.delete({
        where: {
          id: input.id,
        },
      });

      return file;
    }),

  getFile: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { key } = input;

      const file = await ctx.db.file.findFirst({
        where: {
          key,
          userId,
        },
      });

      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return file;
    }),

  getFileUploadStatus: protectedProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { fileId } = input;

      const file = await ctx.db.file.findFirst({
        where: {
          id: fileId,
          userId: userId,
        },
      });

      // Use `as const` ensures that the status property of the returned object is inferred to be exactly the string 'PENDING' and nothing else
      if (!file) return { status: "PENDING" as const };

      return { status: file.uploadStatus };
    }),

  getFileMessages: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(), // Defines 'limit' as a number between 1 and 100, can also be null or undefined.
        cursor: z.string().nullish(), // Defines 'cursor' as a string, can also be null or undefined.
        fileId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Extract the user ID from the context's session.
      const userId = ctx.session.user.id;
      // Destructure cursor and fileId from the input.
      const { cursor, fileId } = input;

      // Set the limit for query results, defaulting to INFINITE_QUERY_LIMIT if input.limit is not provided.
      const limit = input.limit ?? INFINITE_QUERY_LIMIT;

      // Find the first file that matches the provided fileId and userId.
      const file = await ctx.db.file.findFirst({
        where: {
          id: fileId,
          userId,
        },
      });

      // If no file is found, throw a 'NOT_FOUND' error.
      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      // Query the database for messages associated with the fileId.
      const messages = await ctx.db.message.findMany({
        where: {
          fileId,
        },
        select: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          text: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        // Use cursor for pagination, if provided.
        cursor: cursor ? { id: cursor } : undefined,
        // Retrieve one more message than the limit to check for more pages.
        take: limit + 1,
      });

      // Initialize nextCursor for pagination control.
      let nextCursor: typeof cursor | undefined = undefined;

      // If more messages are retrieved than the limit, set nextCursor for the next page.
      if (messages.length > limit) {
        // Remove and retrieve the last item from the messages array.
        // This item is used to determine the cursor for the next set of results.
        const nextItem = messages.pop();

        // Set nextCursor to the ID of the nextItem.
        // The optional chaining (?.) ensures that if nextItem is undefined, nextCursor will also be undefined.
        nextCursor = nextItem?.id;
      }

      // Return the messages and the next cursor for pagination.
      return {
        messages,
        nextCursor,
      };
    }),
});
