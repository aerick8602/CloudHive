import { useState } from "react";
import { DriveCard } from "../drive-card";
import { FileData } from "@/interface";
import useSWR from "swr";
import { fetcher } from "@/utils/apis/fetch";
import { DriveFacetedFilter } from "../faceted-filter";
import { AppBreadcrumb } from "../breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Updated import

import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import {
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from "@tabler/icons-react";
import { swrConfig } from "@/hooks/use-swr";
import { useAuthState } from "react-firebase-hooks/auth";
import { clientAuth } from "@/lib/firebase/firebase-client";

export function DriveContent({ 
  accounts, 
  uid, 
  setCurrentParentId,
  setFolderEmail,
  searchQuery 
}: { 
  accounts: any[]; 
  uid: string; 
  setCurrentParentId: (id: string) => void;
  setFolderEmail: (email: string) => void;
  searchQuery: string;
}) {
  const [currentFolderId, setCurrentFolderId] = useState("root");
  const [activeEmail, setActiveEmail] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<{ id: string; name: string }[]>(
    []
  );
  const [filterOption, setFilterOption] = useState<string>("lastOpened"); // Single state for both sorting and time filters

  const queryKey =
    currentFolderId === "root" && !activeEmail
      ? `/api/file/all/${uid}?trashed=false`
      : activeEmail
        ? `/api/file/${activeEmail}?parentId=${currentFolderId}&trashed=false`
        : null;

  const { data, error, isLoading, mutate } = useSWR(queryKey, fetcher, {
    ...swrConfig,
  });

  const files: FileData[] = data?.files || [];

  const handleFolderClick = (
    folderId: string,
    email: string,
    folderName: string
  ) => {
    setCurrentParentId(folderId);
    setFolderEmail(email);
    setCurrentFolderId(folderId);
    setActiveEmail(email);
    setBreadcrumb((prev) => [
      ...prev.filter((crumb) => crumb.id !== folderId),
      { id: folderId, name: folderName },
    ]);
  };

  // const handleBreadcrumbClick = (folderId: string, email: string | null) => {
  //   setCurrentFolderId(folderId);
  //   setActiveEmail(email);
  //   if (folderId === "root") {
  //     setBreadcrumb([]);
  //   }
  // };

  const handleBreadcrumbClick = (folderId: string, email: string | null) => {
    setCurrentFolderId(folderId);
    setActiveEmail(email);
    if (email) setFolderEmail(email);
    setCurrentParentId(folderId);

    if (folderId === "root") {
      // Reset to root
      setBreadcrumb([]);
    } else {
      // Trim breadcrumb to the clicked folder
      setBreadcrumb((prev) => {
        const index = prev.findIndex((crumb) => crumb.id === folderId);
        if (index === -1) return prev;
        return prev.slice(0, index + 1);
      });
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

  // Function to extract just the date part (YYYY-MM-DD) from the timestamp
  const extractDate = (dateString: string) => {
    return new Date(dateString).toISOString().split("T")[0]; // "YYYY-MM-DD"
  };

  // Function to filter by time range
  const filterFilesByTime = (file: FileData) => {
    const modifiedDate = extractDate(file.modifiedTime || file.createdTime);
    const today = extractDate(new Date().toISOString());

    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = extractDate(yesterday.toISOString());

    switch (filterOption) {
      case "today":
        return modifiedDate === today;
      case "yesterday":
        return modifiedDate === yesterdayDate;
      case "last7days":
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoDate = extractDate(sevenDaysAgo.toISOString());
        return modifiedDate >= sevenDaysAgoDate && modifiedDate <= today;
      case "last30days":
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoDate = extractDate(thirtyDaysAgo.toISOString());
        return modifiedDate >= thirtyDaysAgoDate && modifiedDate <= today;
      default:
        return true; // No filter applied
    }
  };

  // Function to sort files based on selected option
  const sortFiles = (files: FileData[]) => {
    return files.sort((a, b) => {
      const dateA = a.viewedByMe === false ? a.modifiedTime : a.viewedByMeTime;
      const dateB = b.viewedByMe === false ? b.modifiedTime : b.viewedByMeTime;

      // Extract date from timestamps
      const dateAParsed = new Date(dateA);
      const dateBParsed = new Date(dateB);

      return dateBParsed.getTime() - dateAParsed.getTime(); // Default to sorting by last opened
    });
  };

  // Apply filters before passing to DriveCard
  const filteredFiles = files.filter((file) => {
    const matchesAccount =
      accountFilter.length === 0 || accountFilter.includes(file.email);

    const matchesType =
      typeFilter.length === 0 ||
      typeFilter.some((type) => file.mimeType.toLowerCase().includes(type));

    const matchesTime = filterFilesByTime(file);

    const matchesSearch = searchQuery === "" || 
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (file.mimeType === "application/vnd.google-apps.folder" && 
       file.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesAccount && matchesType && matchesTime && matchesSearch;
  });

  const sortedFiles = sortFiles(filteredFiles);

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
      <div className="flex gap-2 px-5 mb-2 justify-between">
        <div className="flex gap-1 lg:gap-2">
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

        {/* Filter Options */}
        <Select value={filterOption} onValueChange={setFilterOption}>
          <SelectTrigger className="w-16 -mr-3 ">
            <SelectValue>
              <IconAdjustmentsHorizontal size={18} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="end">
            {/* Sorting Options */}
            <SelectItem value="lastOpened">
              <div className="flex items-center gap-4">
                <span>Last opened</span>
              </div>
            </SelectItem>
            <SelectItem value="modifiedTime">
              <div className="flex items-center gap-4">
                <span>Last modified</span>
              </div>
            </SelectItem>

            <div className="border-t border-gray-300 my-2" />

            {/* Time Filter Options */}
            <SelectItem value="today">
              <div className="flex items-center gap-4">
                <span>Today</span>
              </div>
            </SelectItem>
            <SelectItem value="yesterday">
              <div className="flex items-center gap-4">
                <span>Yesterday</span>
              </div>
            </SelectItem>
            <SelectItem value="last7days">
              <div className="flex items-center gap-4">
                <span>Last 7 Days</span>
              </div>
            </SelectItem>
            <SelectItem value="last30days">
              <div className="flex items-center gap-4">
                <span>Last 30 Days</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Drive Cards */}
      <div className="overflow-y-auto max-h-[calc(100vh-11rem)] mb-9">
        <DriveCard
          tab="Drive"
          allFile={sortedFiles}
          allLoading={isLoading}
          onFolderClick={handleFolderClick}
          hasFolders={true}
          bgImage="Drive.svg"
          bgfirstMessage="A place for all of your files"
          bgsecondMessage="Use the 'New' button to upload your files and folders"
        />
      </div>
    </div>
  );
}
