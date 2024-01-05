"use client";

import { useAuth } from "hooks/useAuth";
import { useSession } from "next-auth/react";
import ChatWrapper from "~/components/ChatWrapper";
import PdfRenderer from "~/components/PdfRenderer";
import { api } from "~/trpc/react";

interface PageProps {
  params: {
    fileId: string;
  };
}

const FilePage = ({ params }: PageProps) => {
  useAuth();

  // Retrieve the file id
  const { fileId } = params;

  const { data: session, status } = useSession();

  if (status === "loading" || !session) {
    return null;
  }

  // Make database call
  const { data: file } = api.file.fetchFile.useQuery({ id: fileId });

  return (
    <>
      <title>Molly | File</title>
      <div className="flex h-[calc(100vh-3.5rem)] flex-1 flex-col justify-between">
        <div className="mx-auto w-full max-w-7xl grow lg:flex xl:px-2">
          {/* Left side */}
          <div className="flex-1 xl:flex">
            <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
              <PdfRenderer />
            </div>
          </div>

          {/* Right side */}
          <div className="flex-[0.75] shrink-0 border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
            <ChatWrapper />
          </div>
        </div>
        {fileId}
      </div>
    </>
  );
};

export default FilePage;
