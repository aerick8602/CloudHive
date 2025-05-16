import CloudHive from "@/components/cloudhive";
import { adminAuth } from "@/lib/firebase/firebase-admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import redis from "@/lib/cache/redis.config";
import MaintenanceError from "./errors/maintenance-error";
import GeneralError from "./errors/general-error";
import axios from "axios";

const CACHE_EXPIRES_IN = Number(process.env.CACHE_TTL!);

export default async function Home() {
  const appMode = await redis.get("appMode");
  if (appMode === "maintenance") return <MaintenanceError />;

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(process.env.SESSION!);

  if (!sessionCookie) return redirect("/auth/sign-in");

  let uid: string;

  try {
    const decodedToken = await adminAuth.verifySessionCookie(
      sessionCookie.value,
      true
    );
    uid = decodedToken.uid;
  } catch (err) {
    console.error(
      "Invalid session. Redirecting to logout to clear cookies.",
      err
    );
    // 🔁 Redirect to logout API which will delete cookie and then redirect
    // await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`);
    return redirect("/auth/unauthorized");
  }

  // try {
  //   // 🚀 Load accounts
  //   let accounts: any[] = [];
  //   const cachedAccounts = await redis.get(`accounts:${uid}`);
  //   if (cachedAccounts) {
  //     accounts = JSON.parse(cachedAccounts);
  //     console.log("Accounts (from cache):", accounts);
  //   } else {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/api/${uid}/accounts`,
  //       {
  //         headers: { Cookie: `${process.env.SESSION}=${sessionCookie.value}` },
  //       }
  //     );

  //     if (!res.ok) throw new Error("Failed to fetch accounts");

  //     const json = await res.json();
  //     const list = json?.accounts?.[0] || [];

  //     await redis.set(
  //       `accounts:${uid}`,
  //       JSON.stringify(list),
  //       "EX",
  //       CACHE_EXPIRES_IN
  //     );
  //     accounts = list;
  //   }

  //   // 🚀 Load OAuth URL
  //   let oauthUrl = await redis.get(`oauth:${uid}`);
  //   if (!oauthUrl) {
  //     const oauthRes = await fetch(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/api/google/${uid}/oauth`,
  //       {
  //         headers: { Cookie: `${process.env.SESSION}=${sessionCookie.value}` },
  //       }
  //     );
  //     if (!oauthRes.ok) throw new Error("Failed to fetch OAuth URL");

  //     oauthUrl = await oauthRes.text();
  //     await redis.set(`oauth:${uid}`, oauthUrl, "EX", CACHE_EXPIRES_IN);
  //   }

  //   return <CloudHive uid={uid} accounts={accounts} oauthUrl={oauthUrl} />;
  // } catch (err) {
  //   console.error("Data fetch error:", err);
  //   return <GeneralError />;
  // }

  try {
    // Try fetching cached data from Redis
    const cachedAccounts = await redis.get(`accounts:${uid}`);
    const cachedOauthUrl = await redis.get(`oauth:${uid}`);

    // If cache missing, fallback to empty/default values
    const accounts = cachedAccounts ? JSON.parse(cachedAccounts) : [];
    const oauthUrl = cachedOauthUrl || "";

    return (
      <CloudHive
        uid={uid}
        initialAccounts={accounts}
        initialOauthUrl={oauthUrl}
      />
    );
  } catch (err) {
    console.error("Error reading from Redis", err);
    return <GeneralError />;
  }
}
