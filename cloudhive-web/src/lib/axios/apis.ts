type Account = { email: string };
type SetAccountsFunction = (accounts: Account[]) => void;
type SetActiveAccountFunction = (account: Account) => void;

const fetchAccounts = async (
  setAccounts: SetAccountsFunction,
  setActiveAccount: SetActiveAccountFunction
) => {
  try {
    const res = await fetch("http://127.0.0.1:8000/cloud/accounts");
    // if (!res.ok) {
    //   throw new Error(`HTTP error! Status: ${res.status}`);
    // }
    const data = await res.json();

    const google_accounts: Account[] = Array.isArray(data.accounts.google)
      ? data.accounts.google.map((email: string) => ({
          email,
        }))
      : [];

    setAccounts(google_accounts);

    if (!localStorage.getItem("activeAccount") && google_accounts.length > 0) {
      setActiveAccount(google_accounts[0]);
      localStorage.setItem("activeAccount", JSON.stringify(google_accounts[0]));
    }
  } catch (error) {
    console.error("Failed to fetch accounts", error);
    setAccounts([]);
  }
};

const fetchAuthUrl = async (
  email: string | null | undefined,
  setAuthUrl: (url: string) => void
) => {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/cloud/google/login?primary=${email}`
    );

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    setAuthUrl(data.auth_url);
  } catch (error) {
    console.error("Failed to fetch auth URL:", error);
  }
};

export { fetchAccounts, fetchAuthUrl };
