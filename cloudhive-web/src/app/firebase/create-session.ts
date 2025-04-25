export const createSessionWithIdToken = async (idToken: string) => {
  const apiUrl =
    process.env.NEXT_PUBLIC_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://localhost:8000";

  await fetch(`${apiUrl}/auth/create-session`, {
    method: "POST",
    credentials: "include", // Important to send the cookie
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });
};
