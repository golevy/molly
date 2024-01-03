import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { TailwindIndicator } from "~/components/TailwindIndicator";
import Navbar from "~/components/Navbar";
import { Toaster } from "react-hot-toast";
import AuthProvider from "~/components/providers/AuthProvider";
import { TooltipProvider } from "~/components/ui/tooltip";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "grainy min-h-screen font-sans antialiased",
          inter.variable,
        )}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Navbar />
              {children}
              <TailwindIndicator />
            </TooltipProvider>
          </AuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
