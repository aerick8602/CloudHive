export const endSession = async (): Promise<boolean> => {
  try {
    const apiUrl =
      process.env.ENV === "production"
        ? process.env.NEXT_PUBLIC_API_URL
        : "http://localhost:8000";

    const res = await fetch(`${apiUrl}/auth/end-session`, {
      method: "POST",
      credentials: "include", // Important: send cookies
    });

    return res.ok;
  } catch (err) {
    console.error("Error ending session:", err);
    return false;
  }
};
