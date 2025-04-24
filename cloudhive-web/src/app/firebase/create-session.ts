export const createSessionWithIdToken = async (idToken: string) => {
  await fetch("http://localhost:8000/auth/create-session", {
    method: "POST",
    credentials: "include", // Important to set the cookie
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });
};
