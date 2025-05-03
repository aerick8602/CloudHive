import axios from "axios";

// Fetch linked cloud accounts
export const fetchAccounts = async (uid: string) => {
  const res = await axios.get(`/${uid}/accounts`);
  return res.data.accounts as { email: string; _id: string }[];
};

// Fetch auth URL to add new cloud account
export const fetchAuthUrl = async (url: string) => {
  const res = await axios.get(url);
  return res.data.authUrl as string;
};
