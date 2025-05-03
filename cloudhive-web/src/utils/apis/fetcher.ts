import axiosInstance from "@/lib/axios";

// Fetch linked cloud accounts
export const fetchAccounts = async (uid: string) => {
  const res = await axiosInstance.get(`/${uid}/accounts`);
  return res.data.accounts as { email: string; _id: string }[];
};

// Fetch auth URL to add new cloud account
export const fetchAuthUrl = async (url: string) => {
  const res = await axiosInstance.get(url);
  return res.data.authUrl as string;
};
