import axios from "axios";

// Verify user session
const fetchSession = (url: string) => axios.get(url).then((res) => res.data);

// Get all linked cloud accounts
const fetchAccounts = (url: string) => axios.get(url).then((res) => res.data);

// Get auth URL to link a new cloud account
const fetchOauthUrl = (url: string) => axios.get(url).then((res) => res.data);

export { fetchAccounts, fetchSession, fetchOauthUrl };
