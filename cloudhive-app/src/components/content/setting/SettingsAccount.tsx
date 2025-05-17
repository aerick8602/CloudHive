import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatBytes } from "@/lib/utils/format";
import { StorageInfo } from "@/types/storage";
import useSWR from "swr";
import { fetcher } from "@/utils/apis/fetch";
import { swrConfig } from "@/hooks/use-swr";
import { Skeleton } from "@/components/ui/skeleton";

const storageText = new Map<string, string>([
  ["all", "All Accounts"],
  ["used", "Most Used"],
  ["free", "Most Free"],
  ["active", "Active"],
  ["connected", "Connected"],
]);

export function SettingsAccount({ uid }: { uid: string }) {
  const { data, error, isLoading } = useSWR(
    `/api/file/all/${uid}/storage`,
    fetcher,
    {
      ...swrConfig,
    }
  );

  const [sort, setSort] = useState("ascending");
  const [searchTerm, setSearchTerm] = useState("");
  const [storageType, setStorageType] = useState("all");

  if (isLoading) {
    return (
      <div className="flex-1 min-h-0">
        <div className="h-full flex flex-col">
          <div className="px-4 pt-6">
            <h1 className="text-2xl font-bold tracking-tight">
              Account Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your connected accounts and their storage settings
            </p>
          </div>
          <div className="px-4 my-4 flex items-end justify-between sm:my-0 sm:items-center">
            <div className="flex flex-col gap-4 sm:my-4 sm:flex-row">
              <div className="h-9 w-40 lg:w-[250px]">
                <Input
                  placeholder="Search accounts..."
                  className="h-9 w-full"
                  disabled
                />
              </div>
              <div className="h-9 w-36">
                <Select disabled>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Accounts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Accounts</SelectItem>
                    <SelectItem value="used">Most Used</SelectItem>
                    <SelectItem value="free">Most Free</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="connected">Connected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="h-9 w-16">
              <Select disabled>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <IconAdjustmentsHorizontal size={18} />
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="ascending">
                    <div className="flex items-center gap-4">
                      <IconSortAscendingLetters size={16} />
                      <span>Ascending</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="descending">
                    <div className="flex items-center gap-4">
                      <IconSortDescendingLetters size={16} />
                      <span>Descending</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator className="shadow-sm" />
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="px-4 py-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                      <div className="mt-4 pt-4 border-t space-y-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Failed to load storage information</div>;
  }

  const sortedAccounts = Object.entries(
    data?.storageInfo as Record<string, StorageInfo>
  )
    .sort(([a], [b]) =>
      sort === "ascending" ? a.localeCompare(b) : b.localeCompare(a)
    )
    .filter(([email]) => email.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(([, info]) => {
      if (storageType === "active") {
        return parseInt(info.usage || "0") > 0;
      } else if (storageType === "connected") {
        return !info.error;
      }
      return true;
    })
    .sort(([, a], [, b]) => {
      const usageA = parseInt(a.usage || "0");
      const usageB = parseInt(b.usage || "0");
      const limitA = parseInt(a.limit || "0");
      const limitB = parseInt(b.limit || "0");
      const freeA = limitA - usageA;
      const freeB = limitB - usageB;

      if (storageType === "used") {
        return usageB - usageA;
      } else if (storageType === "free") {
        return freeB - freeA;
      }
      return 0;
    });

  return (
    <div className="flex-1 min-h-0">
      <div className="h-full flex flex-col">
        <div className="px-4 pt-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Account Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your connected accounts and their storage settings
          </p>
        </div>
        <div className="px-4 my-4 flex items-end justify-between sm:my-0 sm:items-center">
          <div className="flex flex-col gap-4 sm:my-4 sm:flex-row">
            <Input
              placeholder="Search accounts..."
              className="h-9 w-40 lg:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={storageType} onValueChange={setStorageType}>
              <SelectTrigger className="w-36">
                <SelectValue>{storageText.get(storageType)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                <SelectItem value="used">Most Used</SelectItem>
                <SelectItem value="free">Most Free</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="connected">Connected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-16 -mr-3">
              <SelectValue>
                <IconAdjustmentsHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="ascending">
                <div className="flex items-center gap-4">
                  <IconSortAscendingLetters size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value="descending">
                <div className="flex items-center gap-4">
                  <IconSortDescendingLetters size={16} />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className="shadow-sm" />
        <div className="flex-1 min-h-0 overflow-y-auto">
          <ul className="px-4 py-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedAccounts.map(([email, info]) => {
              const usage = parseInt(info.usage || "0");
              const limit = parseInt(info.limit || "0");
              const percentage = (usage / limit) * 100;
              const isActive = usage > 0;

              return (
                <li
                  key={email}
                  className="rounded-lg border p-4 hover:shadow-md transition-shadow"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <Avatar className="size-10">
                      <AvatarImage src={info.user.photoLink} />
                      <AvatarFallback>
                        {info.user.displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border border-blue-600 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900 dark:text-blue-300"
                      >
                        Connected
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${
                          isActive
                            ? "border border-green-600 bg-green-100 hover:bg-green-200 text-green-700 dark:border-green-700 dark:bg-green-950 dark:hover:bg-green-900 dark:text-green-300"
                            : "border border-gray-600 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:border-gray-700 dark:bg-gray-950 dark:hover:bg-gray-900 dark:text-gray-300"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h2 className="mb-1 font-semibold">
                      {info.user.displayName}
                    </h2>
                    <p className="text-sm text-gray-500 mb-3">{email}</p>
                    {info.error ? (
                      <div className="text-red-500 text-sm">{info.error}</div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Storage Used</span>
                          <span className="font-medium">
                            {formatBytes(parseInt(info.usage || "0"))} of{" "}
                            <span className="font-medium text-green-600">
                              {formatBytes(parseInt(info.limit || "0"))}
                            </span>
                          </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <div className="mt-4 pt-4 border-t space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Usage Percentage</span>
                            <span className="font-medium">
                              {percentage.toFixed(1)}&nbsp;%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Drive Usage</span>
                            <span className="font-medium">
                              {formatBytes(parseInt(info.usageInDrive || "0"))}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Trash Usage</span>
                            <span className="font-medium">
                              {formatBytes(
                                parseInt(info.usageInDriveTrash || "0")
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
