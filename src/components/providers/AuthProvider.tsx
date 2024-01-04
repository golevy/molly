"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import AuthModal from "~/components/auth/AuthModal";

interface ChildrenProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: ChildrenProps) {
  return (
    <SessionProvider>
      {children}
      <AuthModal />
    </SessionProvider>
  );
}
