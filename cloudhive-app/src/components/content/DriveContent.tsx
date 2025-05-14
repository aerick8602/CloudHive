"use client";
import { useState } from "react";
import { DriveCard } from "../drive-card";
import { FileData } from "@/interface";
import useSWR from "swr";
import { fetcher } from "@/utils/apis/fetch";
import { DriveFacetedFilter } from "../faceted-filter";
import { AppBreadcrumb } from "../breadcrumb";

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

  const { data, isLoading } = useSWR(queryKey, fetcher);

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
    { label: "MP4", value: "mp4" },
    { label: "JPG", value: "jpg" },
    { label: "PNG", value: "png" },
    { label: "DOCX", value: "docx" },
    { label: "XLSX", value: "xlsx" },
    { label: "PPTX", value: "pptx" },
    { label: "ZIP", value: "zip" },
    { label: "TXT", value: "txt" },
    { label: "CSV", value: "csv" },
  ];

  // 🔍 Apply filters before passing to DriveCard
  const filteredFiles = files.filter((file) => {
    const matchesAccount =
      accountFilter.length === 0 || accountFilter.includes(file.email);

    const matchesType =
      typeFilter.length === 0 ||
      typeFilter.some((type) => file.mimeType.toLowerCase().includes(type));

    return matchesAccount && matchesType;
  });

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <AppBreadcrumb
        items={[
          { label: "My Drive", id: "root", email: null },
          ...breadcrumb.map((crumb) => ({
            label: crumb.name,
            id: crumb.id,
            email: activeEmail,
          })),
        ]}
        onCrumbClick={handleBreadcrumbClick}
        className="px-5 py-3"
      />

      {/* Filters */}
      <div className="flex gap-2 px-5 mb-4">
        <DriveFacetedFilter
          title="Accounts"
          selected={accountFilter}
          onChange={setAccountFilter}
          options={accounts.map((email: any) => ({
            label: email.e,
            value: email.e,
          }))}
          widthClass="w-[230px]"
        />
        <DriveFacetedFilter
          title="Types"
          selected={typeFilter}
          onChange={setTypeFilter}
          options={fileTypeOptions}
          widthClass="w-[150px]"
        />
      </div>

      {/* Drive Cards */}
      <div className="overflow-y-auto max-h-[calc(100vh-11rem)] mb-10">
        <DriveCard
          tab="My Drive"
          allFile={filteredFiles}
          allLoading={isLoading}
          onFolderClick={handleFolderClick}
        />
      </div>
    </div>
  );
}
