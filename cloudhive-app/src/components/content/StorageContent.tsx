import useSWR, { mutate } from "swr";
import { formatBytes } from "@/lib/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthState } from "react-firebase-hooks/auth";
import { clientAuth } from "@/lib/firebase/firebase-client";
import { fetcher } from "@/utils/apis/fetch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
  IconDatabase,
  IconTrash,
  IconDice,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { swrConfig } from "@/hooks/use-swr";
import { SettingsAccount } from "./setting/SettingsAccount";
import { StorageInfo } from "@/types/storage";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlertCircle } from "lucide-react";

const storageText = new Map<string, string>([
  ["all", "All Accounts"],
  ["used", "Most Used"],
  ["free", "Most Free"],
  ["active", "Active"],
  ["connected", "Connected"],
]);

function StorageMeterGroup({
  accounts,
}: {
  accounts: Record<string, StorageInfo>;
}) {
  const isMobile = useIsMobile();
  const allAccounts = Object.entries(accounts);

  const totalLimit = allAccounts.reduce(
    (sum, [, info]) => sum + parseInt(info.limit || "0"),
    0
  );
  const totalUsage = allAccounts.reduce(
    (sum, [, info]) => sum + parseInt(info.usage || "0"),
    0
  );
  const totalDriveUsage = allAccounts.reduce(
    (sum, [, info]) => sum + parseInt(info.usageInDrive || "0"),
    0
  );
  const totalTrashUsage = allAccounts.reduce(
    (sum, [, info]) => sum + parseInt(info.usageInDriveTrash || "0"),
    0
  );

  const meters = [
    {
      label: "Total Storage",
      value: totalUsage,
      total: totalLimit,
      color: "bg-blue-600",
      icon: IconDatabase,
    },
    {
      label: "Drive Usage",
      value: totalDriveUsage,
      total: totalLimit,
      color: "bg-green-600",
      icon: IconDice,
    },
    {
      label: "Trash Usage",
      value: totalTrashUsage,
      total: totalLimit,
      color: "bg-red-600",
      icon: IconTrash,
    },
  ];

  return (
    <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
      {meters.map((meter) => {
        const percentage = (meter.value / meter.total) * 100;
        const Icon = meter.icon;
        return (
          <div
            key={meter.label}
            className="rounded-lg border p-4 space-y-2 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2">
              <Icon size={20} className="text-gray-500" />
              <span className="text-sm font-medium">{meter.label}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Used</span>
                <span className="font-medium">{formatBytes(meter.value)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${meter.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>{formatBytes(meter.total)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TotalStorageSummary({
  accounts,
}: {
  accounts: Record<string, StorageInfo>;
}) {
  const isMobile = useIsMobile();
  const allAccounts = Object.entries(accounts);

  const totalLimit = allAccounts.reduce(
    (sum, [, info]) => sum + parseInt(info.limit || "0"),
    0
  );
  const totalUsage = allAccounts.reduce(
    (sum, [, info]) => sum + parseInt(info.usage || "0"),
    0
  );
  const percentage = (totalUsage / totalLimit) * 100;

  const inactiveCount = Object.values(accounts).filter(
    (info) => info.active === false || info.connected === false
  ).length;

  return (
    <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:gap-4">
        <div className={`flex ${"items-center justify-between"}`}>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-300">
              Total Storage
            </h2>
            <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400">
              Across all connected accounts
              {inactiveCount > 0 && (
                <div className=" text-red-600 dark:text-red-400">
                  ({inactiveCount} Inactive)
                </div>
              )}
            </p>
          </div>
          <div className={`text-right ${isMobile ? "mt-2" : ""}`}>
            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-700 dark:text-blue-300">
              {formatBytes(totalUsage)}
            </div>
            <div className="text-xs md:text-sm text-blue-600 dark:text-blue-400">
              of {formatBytes(totalLimit)}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs md:text-sm text-blue-600 dark:text-blue-400">
            <span>Storage Usage</span>
            <span>{percentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 md:h-2.5">
            <div
              className="bg-blue-600 dark:bg-blue-400 h-2 md:h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StorageContent({ accounts, uid }: any) {
  const isMobile = useIsMobile();
  const { data, error, isLoading, mutate } = useSWR(
    `/api/file/all/${uid}/storage`,
    fetcher,
    {
      ...swrConfig,
    }
  );

  if (isLoading) {
    return (
      <div className="peer-[.header-fixed]/header:mt-16 fixed-main flex grow flex-col h-[calc(100vh-2rem)]">
        <div className="px-4 pt-4 md:pt-6">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Storage Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s a list of your connected accounts and their storage
            usage!
          </p>
        </div>
        <div className="px-4 my-3 md:my-4">
          <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 md:p-6">
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2.5 w-full rounded-full" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <div className="h-full overflow-y-auto">
            <div className="px-4 my-3 md:my-4">
              <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg border p-4 space-y-2 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-2 w-full rounded-full" />
                      <div className="flex justify-between text-xs">
                        <Skeleton className="h-3 w-6" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-red-500">Failed to load storage information</p>
          <Button variant="outline" onClick={() => mutate()} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="peer-[.header-fixed]/header:mt-16 fixed-main flex grow flex-col h-[calc(100vh-4rem)]">
      <div className="px-4 pt-4 md:pt-6">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">
          Storage Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s a list of your connected accounts and their storage usage!
        </p>
      </div>
      <div className="px-4 my-3 md:my-4">
        <TotalStorageSummary
          accounts={data?.storageInfo as Record<string, StorageInfo>}
        />
      </div>
      <div className="flex-1 min-h-0">
        <div className="h-full overflow-y-auto pb-4">
          <div className="px-4 my-3 md:my-4">
            <StorageMeterGroup
              accounts={data?.storageInfo as Record<string, StorageInfo>}
            />
          </div>
          {/* <SettingsAccount
            accounts={data?.storageInfo as Record<string, StorageInfo>}
          /> */}
        </div>
      </div>
    </div>
  );
}
