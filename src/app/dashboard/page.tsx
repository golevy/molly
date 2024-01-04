"use client";

import { useAuth } from "hooks/useAuth";
import { useSession } from "next-auth/react";
import React from "react";

const DashboardPage = () => {
  useAuth();

  const { data: session } = useSession();

  return <div className="text-xl">{session?.user.email}</div>;
};

export default DashboardPage;
