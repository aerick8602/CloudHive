import CloudHive from "@/components/cloudhive";
import { adminAuth } from "@/lib/firebase/firebase-admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
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

    const [accountsRes, oauthRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${uid}/accounts`, {
        headers: { Cookie: `${process.env.SESSION}=${sessionCookie.value}` },
        cache: "no-store",
      }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/google/${uid}/oauth`, {
        headers: { Cookie: `${process.env.SESSION}=${sessionCookie.value}` },
        cache: "no-store",
      }),
    ]);

    if (!accountsRes.ok) {
      throw new Error("Failed to fetch accounts");
    }

    if (!oauthRes.ok) {
      throw new Error("Failed to fetch OAuth URL");
    }

    const accounts = await accountsRes.json();
    const oauthUrl = await oauthRes.text();

    return <CloudHive accounts={accounts} oauthUrl={oauthUrl} />;
  } catch (error) {
    console.error("Authentication or data fetch error:", error);
    return redirect("/auth/sign-in");
  }
}
