"use client";
import { useState } from "react";
import { DriveCard } from "../drive-card";
import { FileData } from "@/interface";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/utils/apis/fetch";

export function DriveContent({ accounts, uid }: any) {
  const [currentFolderId, setCurrentFolderId] = useState("root");
  const [activeEmail, setActiveEmail] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<{ id: string; name: string }[]>(
    []
  );

  const queryKey =
    currentFolderId === "root" && !activeEmail
      ? `/api/file/all/${uid}?trashed=false`
      : activeEmail
      ? `/api/file/${activeEmail}?parentId=${currentFolderId}&trashed=false`
      : null;

  const { data, isLoading, error, mutate } = useSWR(queryKey, fetcher);

  const files: FileData[] = data?.files || [];

  const handleFolderClick = (
    folderId: string,
    email: string,
    folderName: string
  ) => {
    setCurrentFolderId(folderId);
    setActiveEmail(email);

    setBreadcrumb((prev) => [
      ...prev.filter((crumb) => crumb.id !== folderId),
      { id: folderId, name: folderName },
    ]);
  };

  const handleBreadcrumbClick = (folderId: string, email: string | null) => {
    setCurrentFolderId(folderId);
    setActiveEmail(email);

    if (folderId === "root") {
      setBreadcrumb([]);
    }
  };

  return (
    <div className="container mx-auto p-2 space-y-4">
      {/* Breadcrumb Navigation */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-opacity-100 pl-5 flex items-center h-14 text-2xl font-semibold rounded-none">
        <Link href="#" onClick={() => handleBreadcrumbClick("root", null)}>
          My Drive
        </Link>
        {breadcrumb.map((crumb) => (
          <span key={crumb.id} className="text-muted-foreground">
            {" / "}
            <Link
              href="#"
              onClick={() => handleBreadcrumbClick(crumb.id, activeEmail)}
            >
              {crumb.name}
            </Link>
          </span>
        ))}
      </div>

      {/* Drive Card */}
      <DriveCard
        tab="My Drive"
        allFile={files}
        allLoading={isLoading}
        onFolderClick={handleFolderClick}
      />
    </div>
  );
}
