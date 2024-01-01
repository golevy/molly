"use client";

import { cn } from "~/lib/utils";
import MaxWidthWrapper from "~/components/MaxWidthWrapper";
import Link from "next/link";
import { Button, buttonVariants } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";
import signIn from "next-auth/react";

const Navbar = () => {
  return (
    <nav
      className={cn(
        "sticky top-0 z-30",
        "h-14 w-full",
        "border-b border-gray-200 bg-white/75",
        "backdrop-blur-lg transition-all",
      )}
    >
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="z-40 flex font-semibold">
            <span>Molly</span>
          </Link>

          {/* TODO: Mobile menu */}

          <div className="hidden items-center space-x-4 sm:flex">
            <>
              <Link
                href="/pricing"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Pricing
              </Link>
              <button
                onClick={() => {}}
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Sign in
              </button>
              <Button
                className={buttonVariants({
                  size: "sm",
                })}
              >
                Get started
                <ArrowRight className="ml-1.5 h-5 w-5" />
              </Button>
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
