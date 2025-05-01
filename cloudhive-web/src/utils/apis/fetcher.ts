import axiosInstance from "@/lib/axios";

// Fetch linked cloud accounts
export const fetchAccounts = async (url: string) => {
  const res = await axiosInstance.get(url);
  return res.data.accounts as { email: string }[];
};

// Fetch auth URL to add new cloud account
export const fetchAuthUrl = async (uid: string) => {
  const res = await axiosInstance.get(`/cloud/google`, { params: { uid } });
  return res.data.authUrl as string;
};
