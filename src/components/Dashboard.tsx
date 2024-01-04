import { cn } from "~/lib/utils";
import UploadButton from "~/components/UploadButton";
import { api } from "~/trpc/react";
import { Ghost, Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { useState } from "react";

const Dashboard = () => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);

  const utils = api.useUtils();

  const { data: files, isLoading } = api.file.fetchAll.useQuery();
  const { mutateAsync: deleteFile } = api.file.deleteFile.useMutation({
    onSuccess: () => {
      utils.file.fetchAll.invalidate();
    },
    onMutate: ({ id }) => {
      setCurrentlyDeletingFile(id);
    },
    onSettled: () => {
      setCurrentlyDeletingFile(null);
    },
  });

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div
        className={cn(
          "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0",
          "mt-8 border-b border-gray-200 pb-5",
        )}
      >
        <h1 className="mb-3 text-5xl font-bold text-gray-900">My Files</h1>
        <UploadButton />
      </div>

      {/* Display all user files */}
      {files && files.length !== 0 ? (
        <ul
          className={cn(
            "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
            "mt-8 divide-y divide-zinc-200",
          )}
        >
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((file) => (
              <li
                key={file.id}
                className={cn(
                  "col-span-1 divide-y divide-gray-200",
                  "rounded-lg bg-white",
                  "shadow transition hover:shadow-lg",
                )}
              >
                {/* File name */}
                <Link
                  href={`/dashboard/${file.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="flex w-full items-center justify-between space-x-6 px-6 pt-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-lg font-medium text-zinc-900">
                          {file.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* File Detail */}
                <div
                  className={cn(
                    "grid grid-cols-3 gap-6",
                    "mt-4 px-6 py-2 text-xs text-zinc-500",
                    "place-items-center",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {format(new Date(file.createdAt), "MMM yyyy")}
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    mocked
                  </div>

                  <Button
                    onClick={() => deleteFile({ id: file.id })}
                    size="sm"
                    className="w-full"
                    variant="destructive"
                  >
                    {currentlyDeletingFile === file.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="text-xl font-semibold">Pretty empty around here</h3>
          <p>Let&apos;s upload your first PDF.</p>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
