"use client";
import { useState } from "react";
import { DriveCard } from "../drive-card";
import { FileData } from "@/interface";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/utils/apis/fetch";
import { DriveFacetedFilter } from "../faceted-filter";

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

  const [accountFilter, setAccountFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const fileTypeOptions = [
    { label: "PDF", value: "pdf" },
    { label: "MP4 ", value: "mp4" },
    { label: "JPG ", value: "jpg" },
    { label: "PNG ", value: "png" },
    { label: "DOCX ", value: "docx" },
    { label: "XLSX ", value: "xlsx" },
    { label: "PPTX", value: "pptx" },
    { label: "ZIP", value: "zip" },
    { label: "TXT ", value: "txt" },
    { label: "CSV ", value: "csv" },
  ];

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className=" z-10 bg-opacity-100 pl-5 flex items-center h-14 text-2xl  rounded-none">
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
      <div className="flex gap-2 px-5 mb-4">
        <DriveFacetedFilter
          title="Accounts"
          selected={accountFilter}
          onChange={setAccountFilter}
          options={accounts.map((email: any) => ({
            label: email.e,
            value: email.e,
          }))}
        />

        <DriveFacetedFilter
          title="Types"
          selected={typeFilter}
          onChange={setTypeFilter}
          options={fileTypeOptions}
        />
      </div>

      {/* Drive Card */}
      <div className="overflow-y-auto max-h-[calc(100vh-8rem)] mb-10">
        <DriveCard
          tab="My Drive"
          allFile={files}
          allLoading={isLoading}
          onFolderClick={handleFolderClick}
        />
      </div>
    </div>
  );
}
