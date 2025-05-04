"use client";
import useSWR from "swr";
import { useMemo, useEffect } from "react";
import { DriveCard } from "../drive-card";
import { AccountProps } from "@/types/AccountProps";
import { swrConfig } from "@/hooks/use-swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function DriveContent({ accounts }: { accounts: AccountProps[] }) {
  // Fetch files for each account
  // const swrResponses = accounts.map((account) => {
  //   const url = `/api/file/${account.e}/root`;
  //   return useSWR(url, fetcher, swrConfig);
  // });

  // Check if any response is still loading or has an error
  // const allLoading = swrResponses.some((res) => res.isLoading);
  // const anyError = swrResponses.find((res) => res.error);

  // // Merge all files from all accounts
  // const allFiles = useMemo(() => {
  //   return swrResponses.flatMap((res) => res.data?.files || []);
  // }, [swrResponses]);

  const allFiles: any = [];

  // Log merged files when available
  useEffect(() => {
    if (allFiles.length) {
      console.log("📁 Merged Files", allFiles);
    }
  }, [allFiles]);

  // Handle errors and loading states
  // if (anyError) return <div className="text-red-500">Failed to load files</div>;
  // if (allLoading)
  //   return <div className="text-muted-foreground">Loading files...</div>;

  // Render the component with the fetched files
  return (
    <div className="container mx-auto p-2 space-y-4">
      <DriveCard email="All Accounts" files={allFiles} loading={false} />
    </div>
  );
}
