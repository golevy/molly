"use client";

import { useAuth } from "hooks/useAuth";
import { useSession } from "next-auth/react";
import Dashboard from "~/components/Dashboard";

const DashboardPage = () => {
  useAuth();

  const { data: session, status } = useSession();

  if (status === "loading" || !session) {
    return null;
  }

  return (
    <>
      <title>Molly | Dashboard</title>
      <Dashboard />
    </>
  );
};

export default DashboardPage;
