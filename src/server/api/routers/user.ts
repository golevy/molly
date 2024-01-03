import { z } from "zod";
import bcrypt from "bcrypt";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input;

      const existingUser = await ctx.db.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        throw new Error("Email taken");
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await ctx.db.user.create({
        data: {
          email,
          name,
          hashedPassword,
        },
      });

      return { success: true, user };
    }),
});
