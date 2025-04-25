export const validateSession = async (
  sessionCookie: string
): Promise<boolean> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://localhost:8000";

  try {
    const res = await fetch(`${apiUrl}/auth/validate-session`, {
      headers: {
        Cookie: `session=${sessionCookie}`,
      },
    });

    return res.ok;
  } catch (err) {
    console.error("Session check failed:", err);
    return false;
  }
};
