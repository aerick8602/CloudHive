"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SearchForm } from "@/components/search-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PulseLoader } from "react-spinners";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useRef, useState } from "react";
import { contentMap } from "@/utils/content";
import { fetcher } from "@/utils/apis/fetch";
import useSWR, { mutate } from "swr";
import { logoutUser } from "@/utils/apis/post";
import { clientAuth } from "@/lib/firebase/firebase-client";
import { useAuthState } from "react-firebase-hooks/auth";
import { AccountProps } from "@/types/AccountProps";
import Image from "next/image";
import { Account } from "@/interface";
import { IconCloudCode, IconInfoCircle } from "@tabler/icons-react";
import Link from "next/link";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UploadErrorToast, UploadToast } from "./upload-toast";
import { toast } from "sonner";

interface CloudHiveProps {
  initialAccounts: AccountProps[];
  initialOauthUrl: string;
  uid: string;
}

export default function CloudHive({
  uid,
  initialAccounts,
  initialOauthUrl,
}: CloudHiveProps) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [oauthUrl, setOauthUrl] = useState(initialOauthUrl);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentActiveAccount, setCurrentActiveAccount] = useState<string>("");
  const [currentParentId, setCurrentParentId] = useState<string>("");
  const [folderEmail, setFolderEmail] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("Drive");
  const [user] = useAuthState(clientAuth);

  // Upload state lifted to parent
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleUpload = async (
    files: FileList,
    isFolder: boolean,
    currentParentId?: string
  ) => {
    if (!files || files.length === 0 || !currentActiveAccount) return;

    setIsUploading(true);
    setUploadProgress(0);

    const totalFiles = files.length;
    const fileText = totalFiles === 1 ? "file" : "files";
    abortControllerRef.current = new AbortController();

    try {
      const formData = new FormData();
      Array.from(files).forEach((file, index) => {
        const path = isFolder ? file.webkitRelativePath : file.name;
        formData.append(`file-${index}`, file);
        formData.append(`path-${index}`, path);
      });

      formData.append("isFolder", String(isFolder));
      formData.append(
        "email",
        currentParentId ? folderEmail : currentActiveAccount
      );
      if (currentParentId) formData.append("currentParentId", currentParentId);
      formData.append("userAppEmail", user!.email!);
      formData.append("totalFiles", String(totalFiles));

      const toastId = toast(
        <UploadToast
          progress={0}
          totalFiles={totalFiles}
          fileText={fileText}
          status="Preparing files..."
        />,
        { duration: Infinity, unstyled: true }
      );

      const response = await fetch("/api/new/upload", {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current?.signal,
        keepalive: true,
      });

      if (!response.ok) throw new Error("Upload failed");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            if (data.progress !== undefined) {
              setUploadProgress(data.progress);
              toast(
                <UploadToast
                  progress={data.progress}
                  totalFiles={totalFiles}
                  fileText={fileText}
                  status={data.status}
                  onClose={() => toast.dismiss(toastId)}
                />,
                { id: toastId, duration: Infinity, unstyled: true }
              );
            }
            if (data.error) throw new Error(data.error);
          }
        }
      }

      // Refresh data
      if (currentParentId === "root" || !currentParentId) {
        mutate(`/api/file/all/${user!.uid}?trashed=false`);
      } else {
        mutate(
          `/api/file/${currentActiveAccount}?parentId=${currentParentId}&trashed=false`
        );
      }
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        (error as { name?: string }).name !== "AbortError"
      ) {
        toast(
          <UploadErrorToast
            totalFiles={totalFiles}
            fileText={fileText}
            progress={uploadProgress}
          />,
          { unstyled: true, duration: 2000 }
        );
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      abortControllerRef.current = null;
    }
  };

  useEffect(() => {
    async function fetchAccountsAndOauth() {
      setLoading(true);
      try {
        const resAccounts = await fetch(`/api/${uid}/accounts`);
        const dataAccounts = await resAccounts.json();
        const accounts = dataAccounts.accounts?.[0].filter(
          (acc: Partial<Account>) => acc.a && acc.c
        );
        setAccounts(accounts || []);

        const resOauth = await fetch(`/api/google/${uid}/oauth`);
        const dataOauth = await resOauth.text();
        setOauthUrl(dataOauth);
      } catch (error) {
        console.error("Error fetching accounts or OAuth URL:", error);
      }
      setLoading(false);
    }

    // Fetch only if initial data was empty
    if (!initialAccounts.length || !initialOauthUrl) {
      fetchAccountsAndOauth();
    }
  }, [uid, initialAccounts.length, initialOauthUrl]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("currentActiveAccount");
    if (savedEmail && accounts.length > 0) {
      // Check if the saved email exists in accounts
      const accountExists = accounts.some(
        (account) => account.e === savedEmail
      );
      if (accountExists) {
        setCurrentActiveAccount(savedEmail);
      } else if (accounts.length > 0) {
        // If saved account doesn't exist, set the first account as active
        setCurrentActiveAccount(accounts[0].e);
      }
    } else if (accounts.length > 0) {
      // If no saved account, set the first account as active
      setCurrentActiveAccount(accounts[0].e);
    } else {
      // If no accounts, clear the active account
      setCurrentActiveAccount("");
    }
  }, [accounts]);

  useEffect(() => {
    if (currentActiveAccount) {
      localStorage.setItem("currentActiveAccount", currentActiveAccount);
    }
  }, [currentActiveAccount]);

  const Component = contentMap[activeTab];
  if (loading)
    return (
      <div className="bg-muted/50 dark:brightness-70 dark:contrast-250 w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden ">
        <Image
          src="/Download-bro.svg"
          alt="Loading..."
          width={500}
          height={500}
          objectFit="cover"
          priority
        />
        <div className=" flex flex-col items-center justify-center  select-none  z-10 px-4 -mt-5">
          <h1 className="text-5xl font-extrabold tracking-wide ">CloudHive</h1>
          <p className="mt-4 text-md opacity-80 flex items-center gap-2">
            Loading your cloud accounts
            <span className="mt-1 -ml-1">
              <PulseLoader size={4} color="#999999" />
            </span>
          </p>
        </div>
      </div>
    );

  return (
    <SidebarProvider>
      <AppSidebar
        variant="inset"
        accounts={accounts}
        oauthUrl={oauthUrl}
        currentActiveAccount={currentActiveAccount}
        setCurrentActiveAccount={setCurrentActiveAccount}
        currentParentId={currentParentId}
        setActiveTab={setActiveTab}
        folderEmail={folderEmail}
        setFolderEmail={setFolderEmail}
        isUploading={isUploading}
        setIsUploading={setIsUploading}
        uploadProgress={uploadProgress}
        onFileUpload={handleUpload}
      />
      <SidebarInset className="h-[calc(100vh-1rem)]">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 justify-between">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <SearchForm
              className="w-full sm:ml-auto sm:w-auto"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          <div className="px-3 flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/about">
                    <Button
                      variant="outline"
                      size="icon"
                      className="cursor-pointer"
                    >
                      <QuestionMarkCircledIcon className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>About</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <ModeToggle />
          </div>
        </header>
        <main className="relative flex-1 rounded-md bg-muted/25 mb-2 ml-2 mr-2 flex flex-col overflow-hidden">
          <Component
            setCurrentParentId={setCurrentParentId}
            uid={uid}
            accounts={accounts}
            setAccounts={setAccounts}
            searchQuery={searchQuery}
            folderEmail={folderEmail}
            setFolderEmail={setFolderEmail}
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
