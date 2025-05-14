import { SWRConfiguration } from "swr";

export const swrOptions: SWRConfiguration = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 5000,
  focusThrottleInterval: 5000,
  refreshInterval: 60000,
  errorRetryInterval: 5000,
  errorRetryCount: 3,
  suspense: false,
  loadingTimeout: 5000,
  onSuccess: (data) => {
    console.log("Data fetched successfully:", data);
  },
  onError: (error) => {
    console.error("Error fetching data:", error);
  },
};
