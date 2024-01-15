"use client";

import * as React from "react";
import { ArrowRight, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import useAuthModal from "store/useAuthModal";

const MobileNav = () => {
  const { data: session } = useSession();

  const { toggleModal } = useAuthModal();

  const [isOpen, setIsOpen] = React.useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const pathname = usePathname();

  // Create a ref to reference the outermost div element of the navigation menu
  const ref = React.useRef<HTMLDivElement | null>(null);

  // Add a global event listener to detect outside clicks when the component mounts
  React.useEffect(() => {
    // Define a function to handle outside clicks
    const handleClickOutside = (event: any) => {
      // Check if the click is outside the navigation menu
      if (ref.current && !ref.current.contains(event.target)) {
        // If so, close the navigation menu
        setIsOpen(false);
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Return a cleanup function to remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  React.useEffect(() => {
    if (isOpen) toggleOpen();
  }, [pathname]);

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen();
    }
  };

  return (
    <div className="sm:hidden" ref={ref}>
      <Menu
        onClick={toggleOpen}
        className="relative z-50 h-5 w-5 text-zinc-700"
      />

      {isOpen ? (
        <div
          className={cn(
            "fixed inset-0 z-0 w-full",
            "animate-in fade-in-20 slide-in-from-top-5",
          )}
        >
          <ul className="absolute grid w-full gap-3 border-b border-zinc-200 bg-white px-10 pb-8 pt-20 shadow-xl">
            {!session ? (
              <>
                <li
                  onClick={() => toggleModal(true)}
                  className="flex w-full items-center font-semibold text-green-600"
                >
                  Get started <ArrowRight className="ml-2 h-5 w-5" />
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li
                  onClick={() => toggleModal(true)}
                  className="flex items-center font-semibold"
                >
                  Sign in
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/pricing")}
                    className="flex items-center font-semibold"
                    href="/pricing"
                  >
                    Pricing
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/pricing")}
                    className="flex items-center font-semibold"
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li
                  onClick={() => signOut()}
                  className="flex w-full items-center font-semibold"
                >
                  Sign out
                </li>
              </>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default MobileNav;
