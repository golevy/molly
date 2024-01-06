"use client";

import { useAuth } from "hooks/useAuth";
import { useSession } from "next-auth/react";
import ChatWrapper from "~/components/chat/ChatWrapper";
import PdfRenderer from "~/components/pdf/PdfRenderer";
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

  // Make database call
  const { data: file } = api.file.fetchFile.useQuery({ id: fileId });

  if (status === "loading" || !session) {
    return null;
  }

  return (
    <>
      <title>Molly | File</title>
      <div className="flex h-[calc(100vh-3.5rem)] flex-1 flex-col justify-between">
        <div className="mx-auto w-full max-w-7xl grow lg:flex xl:px-2">
          {/* Left side */}
          <div className="flex-1 xl:flex">
            <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
              {file && <PdfRenderer url={file.url} />}
            </div>
          </div>

          {/* Right side */}
          <div className="flex-[0.75] shrink-0 border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
            {file && <ChatWrapper fileId={file.id} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilePage;
