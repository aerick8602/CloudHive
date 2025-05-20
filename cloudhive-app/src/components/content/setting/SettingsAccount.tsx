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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import AccountCardSkeleton from "@/components/card/account-card-skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Account {
  e: string; // email
  c: boolean; // connected
  a: boolean; // active
}

interface StorageResponse {
  storageInfo: Record<string, StorageInfo>;
  accounts: Account[][]; // Note: accounts is a nested array
}

const storageText = new Map<string, string>([
  ["all", "All Accounts"],
  ["used", "Most Used"],
  ["free", "Most Free"],
  ["active", "Active"],
  ["connected", "Connected"],
]);

export function SettingsAccount({ uid, accounts, setAccounts }: any) {
  const {
    data: storageData,
    error: storageError,
    isLoading: storageLoading,
    mutate,
  } = useSWR<StorageResponse>(`/api/file/all/${uid}/storage`, fetcher);

  const [sort, setSort] = useState("ascending");
  const [searchTerm, setSearchTerm] = useState("");
  const [storageType, setStorageType] = useState("all");
  const [togglingEmail, setTogglingEmail] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    email: string;
    action: "connect" | "disconnect";
  } | null>(null);

  if (storageError) {
    // Check if it's a 404 error (no accounts found)
    if (storageError.status === 404) {
      return (
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="p-3 rounded-full bg-gray-200 dark:bg-gray-800 mx-auto w-fit">
              <IconDatabase className="w-6 h-6 text-gray-500 dark:text-gray-300" />
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              No accounts connected
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connect your accounts to view storage information
            </p>
          </div>
        </div>
      );
    }

    // For other errors, show the error message
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

  if (!storageData) {
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
            <div className="flex gap-2 lg:gap-4 sm:my-4 sm:flex-row">
              <Input
                disabled
                placeholder="Search accounts..."
                className="h-9 w-36 lg:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                disabled
                value={storageType}
                onValueChange={setStorageType}
              >
                <SelectTrigger className="w-30 lg:w-36">
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
          </div>
          <Separator className="shadow-sm" />
          <div className="px-4 py-6 grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <AccountCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (Object.keys(storageData.storageInfo).length === 0) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="p-3 rounded-full bg-gray-200 dark:bg-gray-800 mx-auto w-fit">
            <IconDatabase className="w-6 h-6 text-gray-500 dark:text-gray-300" />
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            No accounts connected
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Connect your accounts to view storage information
          </p>
        </div>
      </div>
    );
  }

  const sortedAccounts = Object.entries(storageData.storageInfo)
    .sort(([a], [b]) =>
      sort === "ascending" ? a.localeCompare(b) : b.localeCompare(a)
    )
    .filter(([email]) => email.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(([email]) => {
      const account = storageData.accounts[0]?.find((acc) => acc.e === email);
      if (storageType === "active") {
        return account?.a;
      } else if (storageType === "connected") {
        return account?.c;
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

  const handleToggleConnection = async (
    email: string,
    action: "connect" | "disconnect"
  ) => {
    try {
      setTogglingEmail(email);
      const response = await fetch("/api/account/toggle-connectivity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid, email }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle connection");
      }

      const data = await response.json();
      if (data.success) {
        const connectedAccounts = data.accounts.filter(
          (acc: any) => acc.c && acc.a
        );
        setAccounts(connectedAccounts);

        await mutate();
      }
      toast.success(
        data.account.c
          ? "Account connected successfully!"
          : "Account disconnected successfully!"
      );
    } catch (error) {
      console.error("Error toggling connection:", error);
      toast.error("Failed to toggle account connection");
    } finally {
      setTogglingEmail(null);
      setPendingAction(null);
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="flex-1 min-h-0">
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction?.action === "connect"
                ? "Connect Account"
                : "Disconnect Account"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.action === "connect"
                ? "Are you sure you want to connect this account? This will allow access to the account's storage."
                : "Are you sure you want to disconnect this account? This will revoke access to the account's storage."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex w-full !justify-between">
            <AlertDialogCancel className="m-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="m-0"
              onClick={() => {
                if (pendingAction) {
                  handleToggleConnection(
                    pendingAction.email,
                    pendingAction.action
                  );
                }
              }}
            >
              {pendingAction?.action === "connect" ? "Connect" : "Disconnect"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
          <div className="flex gap-2 lg:gap-4 sm:my-4 sm:flex-row">
            <Input
              placeholder="Search accounts..."
              className="h-9 w-36 lg:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={storageType} onValueChange={setStorageType}>
              <SelectTrigger className="w-30 lg:w-36">
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
          <ul className="px-4 py-6 grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {!storageData
              ? Array.from({ length: 3 }).map((_, index) => (
                  <AccountCardSkeleton key={index} />
                ))
              : sortedAccounts.map(([email, info]) => {
                  const usage = parseInt(info.usage || "0");
                  const limit = parseInt(info.limit || "0");
                  const percentage = (usage / limit) * 100;
                  const account = storageData.accounts[0]?.find(
                    (acc) => acc.e === email
                  );
                  const isConnected = account?.c;
                  const isActive = account?.a;
                  const isToggling = togglingEmail === email;

                  return (
                    <li
                      key={email}
                      className="rounded-lg border p-4 hover:shadow-md transition-shadow h-[280px] flex flex-col"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <Avatar className="size-10">
                          <AvatarImage src={info.user?.photoLink} />
                          <AvatarFallback>
                            {info.user?.displayName?.charAt(0).toUpperCase() ||
                              email[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex gap-2">
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
                          {isActive && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setPendingAction({
                                  email,
                                  action: isConnected
                                    ? "disconnect"
                                    : "connect",
                                });
                                setShowConfirmDialog(true);
                              }}
                              disabled={isToggling}
                              className={`${
                                isConnected
                                  ? "border border-blue-600 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900 dark:text-blue-300"
                                  : "border border-gray-600 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:border-gray-700 dark:bg-gray-950 dark:hover:bg-gray-900 dark:text-gray-300"
                              }`}
                            >
                              {isToggling ? (
                                <>
                                  <Loader2 className=" animate-spin" />
                                  {isConnected
                                    ? "Disconnecting..."
                                    : "Connecting..."}
                                </>
                              ) : isConnected ? (
                                "Connected"
                              ) : (
                                "Reconnect"
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h2 className="mb-1 font-semibold">
                          {info.user?.displayName || email}
                        </h2>
                        <p className="text-sm text-gray-500 mb-3">{email}</p>
                        {!isActive ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-3">
                            <div className="p-3 rounded-full bg-gray-200 dark:bg-gray-800">
                              <AlertCircle className="w-6 h-6 text-gray-500 dark:text-gray-300" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Account Inactive
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Please re-authenticate to activate this account
                              </p>
                            </div>
                          </div>
                        ) : !isConnected ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-3">
                            <div className="p-3 rounded-full bg-gray-200 dark:bg-gray-800">
                              <AlertCircle className="w-6 h-6 text-gray-500 dark:text-gray-300" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Account Disconnected
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Connect to view storage information
                              </p>
                            </div>
                          </div>
                        ) : info.error ? (
                          <div className="flex-1 flex items-center justify-center text-red-500 text-sm">
                            {info.error}
                          </div>
                        ) : (
                          <div className="flex-1 space-y-2">
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

                            <div className="mt-3 pt-3 border-t space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Usage Percentage</span>
                                <span className="font-medium">
                                  {percentage.toFixed(1)}&nbsp;%
                                </span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span>Drive Usage</span>
                                <span className="font-medium">
                                  {formatBytes(
                                    parseInt(info.usageInDrive || "0")
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs">
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
