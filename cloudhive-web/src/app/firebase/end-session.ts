export const endSession = async (): Promise<boolean> => {
  try {
    const res = await fetch("http://localhost:8000/auth/end-session", {
      method: "POST",
      credentials: "include", // Important: send cookies
    });

    return res.ok;
  } catch (err) {
    console.error("Error ending session:", err);
    return false;
  }
};
