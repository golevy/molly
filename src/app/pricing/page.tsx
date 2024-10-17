"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { ArrowRight, Check, HelpCircle, Minus } from "lucide-react";
import useAuthModal from "store/useAuthModal";
import MaxWidthWrapper from "~/components/MaxWidthWrapper";
import { buttonVariants } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { PLANS, pricingItems } from "~/config/subscription-plan";
import { cn } from "~/lib/utils";
import { useRouter } from "next/navigation";
import UpgradeButton from "~/components/UpgradeButton";

const PricingPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const { toggleModal } = useAuthModal();

  return (
    <>
      <title>Molly | Pricing</title>
      <MaxWidthWrapper className="mb-8 mt-24 max-w-5xl text-center">
        <div className="mx-auto mb-10 sm:max-w-lg">
          <h1 className="text-6xl font-bold sm:text-7xl">Pricing</h1>
          <p className="mt-5 text-gray-600 sm:text-lg">
            Whether you&apos;re just trying out our service or need more,
            we&apos;ve got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 pt-12 lg:grid-cols-2">
          {pricingItems.map(({ plan, tagline, quota, features }) => {
            const price =
              PLANS.find((p) => p.slug === plan.toLowerCase())?.price.amount ??
              0;

            return (
              <div
                key={plan}
                className={cn(
                  "relative select-none rounded-2xl bg-white shadow-lg",
                  {
                    "border-2 border-blue-600 shadow-blue-200": plan === "Pro",
                    "border border-gray-200": plan !== "Pro",
                  },
                )}
              >
                {/* Pro Subscription Tag */}
                {plan === "Pro" && (
                  <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white">
                    Upgrade now
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <h3 className="my-3 text-center text-xl font-bold">{plan}</h3>
                  <p className="text-gray-500">{tagline}</p>
                  <p className="my-5 text-6xl font-semibold">${price}</p>
                  <p className="text-gray-500">per month</p>
                </div>

                {/* Quota */}
                <div className="flex h-20 items-center justify-center rounded-b-2xl border-b border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-1">
                    <p>{quota.toLocaleString()} PDFs/mo include</p>
                  </div>

                  <Tooltip delayDuration={300}>
                    <TooltipTrigger className="ml-1.5 cursor-default">
                      <HelpCircle className="h-4 w-4 text-zinc-500" />
                    </TooltipTrigger>
                    <TooltipContent className="w-80 p-2">
                      How many PDFs you can upload per month.
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Footnote */}
                <ul className="my-10 space-y-5 px-8">
                  {features.map(({ text, footnote, negative }) => (
                    <li key={text} className="flex space-x-5">
                      <div className="flex-shrink-0">
                        {negative ? (
                          <Minus className="h-6 w-6 text-gray-300" />
                        ) : (
                          <Check className="h-6 w-6 text-blue-500" />
                        )}
                      </div>
                      {footnote ? (
                        <div className="flex items-center space-x-1">
                          <p
                            className={cn("text-gray-600", {
                              "text-gray-400": negative,
                            })}
                          >
                            {text}
                          </p>
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger className="ml-1.5 cursor-default">
                              <HelpCircle className="h-4 w-4 text-zinc-500" />
                            </TooltipTrigger>
                            <TooltipContent className="w-80 p-2">
                              {footnote}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      ) : (
                        <p
                          className={cn("text-gray-600", {
                            "text-gray-400": negative,
                          })}
                        >
                          {text}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-200" />

                <div className="p-5">
                  {plan === "Free" ? (
                    <div
                      onClick={() => {
                        if (!user) {
                          toggleModal(true);
                        } else {
                          router.push("/dashboard");
                        }
                      }}
                      className={buttonVariants({
                        className: "w-full",
                        variant: "secondary",
                      })}
                    >
                      {user ? "Upgrade now" : "Sign up"}
                      <ArrowRight className="ml-1.5 h-5 w-5" />
                    </div>
                  ) : user ? (
                    <UpgradeButton />
                  ) : (
                    <div
                      onClick={() => {
                        if (!user) {
                          router.push("/");
                          toggleModal(true);
                        }
                      }}
                      className={buttonVariants({
                        className: "w-full",
                      })}
                    >
                      {user ? "Upgrade now" : "Sign up"}
                      <ArrowRight className="ml-1.5 h-5 w-5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </MaxWidthWrapper>
    </>
  );
};

export default PricingPage;
