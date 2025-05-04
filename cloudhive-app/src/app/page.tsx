import CloudHive from "@/components/cloudhive";
import { adminAuth } from "@/lib/firebase/firebase-admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import redis from "@/lib/cache/redis.config";
import MaintenanceError from "./errors/maintenance-error";
import GeneralError from "./errors/general-error";

const CACHE_EXPIRES_IN = Number(process.env.CACHE_TTL!);

export default async function Home() {
  const appMode = await redis.get("appMode");
  if (appMode === "maintenance") {
    return <MaintenanceError />;
  }
  const sessionCookie = (await cookies()).get(process.env.SESSION!);

  if (!sessionCookie) {
    return redirect("/auth/sign-in");
  }

  try {
    const decodedToken = await adminAuth.verifySessionCookie(
      sessionCookie.value,
      true
    );

    const uid = decodedToken.uid;

    // 🚀 Try Redis cache for accounts
    const cachedAccounts = await redis.get(`accounts:${uid}`);
    let accounts;
    if (cachedAccounts) {
      accounts = JSON.parse(cachedAccounts);
    } else {
      const accountsRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/${uid}/accounts`,
        {
          headers: { Cookie: `${process.env.SESSION}=${sessionCookie.value}` },
        }
      );

      if (!accountsRes.ok) {
        throw new Error("Failed to fetch accounts");
      }

      const accountsJson = await accountsRes.json();

      // Assuming the accounts are inside the first array element
      const accountsList = accountsJson?.accounts || [];

      await redis.set(
        `accounts:${uid}`,
        JSON.stringify(accountsList[0]),
        "EX",
        CACHE_EXPIRES_IN
      );

      console.log("Accounts:", accountsList[0]); // Corrected to use `accountsList`
      accounts = accountsList[0]; // Assigning directly without nesting
    }

    // 🚀 Try Redis cache for oauthUrl
    const cachedOauthUrl = await redis.get(`oauth:${uid}`);
    let oauthUrl;
    if (cachedOauthUrl) {
      oauthUrl = cachedOauthUrl;
    } else {
      const oauthRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/google/${uid}/oauth`,
        {
          headers: { Cookie: `${process.env.SESSION}=${sessionCookie.value}` },
        }
      );

      if (!oauthRes.ok) {
        throw new Error("Failed to fetch OAuth URL");
      }

      oauthUrl = await oauthRes.text();
      console.log("OauthUrl :", oauthUrl);
      await redis.set(`oauth:${uid}`, oauthUrl, "EX", CACHE_EXPIRES_IN);
    }

    return <CloudHive accounts={accounts} oauthUrl={oauthUrl} />;
  } catch (error) {
    console.error("Authentication or data fetch error:", error);

    try {
      // Attempt logout in case of an error
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Cookie: `${process.env.SESSION}=${sessionCookie?.value}`,
        },
      });
    } catch (logoutError) {
      console.error("Logout error:", logoutError);
    }

    // Redirect to 500 page if there's an error
    return <GeneralError />;
  }
}
