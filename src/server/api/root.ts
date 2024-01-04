import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { fileRouter } from "~/server/api/routers/file";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  file: fileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
