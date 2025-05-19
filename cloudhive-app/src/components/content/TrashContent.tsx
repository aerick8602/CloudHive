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
import { Button } from "@/components/ui/button";
import { IconAdjustmentsHorizontal, IconTrash, IconCheck, IconX } from "@tabler/icons-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

import {
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from "@tabler/icons-react";

import { swrConfig } from "@/hooks/use-swr";

export function TrashContent({ 
  accounts, 
  uid,
  searchQuery 
}: { 
  accounts: any[]; 
  uid: string;
  searchQuery: string;
}) {
  const [currentFolderId, setCurrentFolderId] = useState("root");
  const [activeEmail, setActiveEmail] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<{ id: string; name: string }[]>(
    []
  );
  const [filterOption, setFilterOption] = useState<string>("lastOpened"); // Single state for both sorting and time filters
  const [isDeleting, setIsDeleting] = useState(false);

  const queryKey =
    currentFolderId === "root" && !activeEmail
      ? `/api/file/all/${uid}?trashed=true`
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

  const handleEmptyBin = async () => {
    if (isDeleting) return; // Prevent multiple clicks
    
    setIsDeleting(true);
    try {
      // Get all files with their emails and IDs
      const filesToDelete = files.map(file => ({
        id: file.id,
        email: file.email
      }));
      
      // Delete all files in parallel using their respective emails
      const deletePromises = filesToDelete.map(({ id, email }) => 
        fetch(`/api/file/${email}/update/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ permanentlyDelete: true })
        })
      );
      
      await Promise.all(deletePromises);
      
      // Show success message
      toast.success("All items have been permanently deleted", {
        duration: 3000,
      });
      
      // Refresh the data using mutate
      await mutate();
      
      // Reset current folder to root and clear breadcrumb
      setCurrentFolderId("root");
      setActiveEmail(null);
      setBreadcrumb([]);
      
    } catch (error) {
      console.error('Error emptying bin:', error);
      // Show error message
      toast.error("Failed to empty bin. Please try again.", {
        duration: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <AppBreadcrumb
        items={[
          { label: "Trash", id: "root", email: null },
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
      <div className="flex gap-2 px-5 mb-2 justify-between items-center">
        <div className="flex gap-1 lg:gap-2 items-center">
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

        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
       
                size="lg"
                className="flex items-center gap-2"
                disabled={files.length === 0 || isDeleting}
              >
                <IconTrash size={20} />
                {isDeleting ? "Deleting..." : "Empty Bin"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Empty Bin</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to permanently delete all items in the trash? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row !justify-between">
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleEmptyBin}
                  disabled={isDeleting}
                  className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete All"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Select value={filterOption} onValueChange={setFilterOption}>
            <SelectTrigger className="w-16 -mr-4 lg:mr-0">
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
      </div>

      {/* Drive Cards */}
      <div className="overflow-y-auto max-h-[calc(100vh-11rem)] mb-9">
        <DriveCard
          tab="Trash"
          allFile={sortedFiles}
          allLoading={isLoading}
          onFolderClick={handleFolderClick}
          hasFolders={true}
          bgImage="Trash.svg"
          bgfirstMessage="Bin is Empty"
          bgsecondMessage="Items moved to the bin will be deleted forever after 30 day"
        />
      </div>
    </div>
  );
}
