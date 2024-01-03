"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

interface ChildrenProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: ChildrenProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
