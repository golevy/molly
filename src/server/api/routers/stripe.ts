import { TRPCError } from "@trpc/server";
import { PLANS } from "~/config/stripe";
import { absoluteUrl } from "~/lib/utils";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getUserSubscriptionPlan, stripe } from "~/lib/stripe";

export const stripeRouter = createTRPCRouter({
  createStripeSession: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const billingUrl = absoluteUrl("/dashboard/billing");
    console.log(
      "🚀 ~ createStripeSession:protectedProcedure.mutation ~ billingUrl:",
      billingUrl,
    );

    const dbUser = await ctx.db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!dbUser)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not found",
      });

    const subscriptionPlan = await getUserSubscriptionPlan();
    console.log(
      "🚀 ~ createStripeSession:protectedProcedure.mutation ~ subscriptionPlan:",
      subscriptionPlan,
    );

    if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: billingUrl,
      });

      return { url: stripeSession.url };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card", "paypal"],
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price: PLANS.find((plan) => plan.name === "Pro")?.price.priceIds.test,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
      },
    });
    console.log(
      "🚀 ~ createStripeSession:protectedProcedure.mutation ~ stripeSession:",
      stripeSession,
    );

    return { url: stripeSession.url };
  }),
});
