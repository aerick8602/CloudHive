export const validateSession = async (
  sessionCookie: string
): Promise<boolean> => {
  try {
    const res = await fetch("http://localhost:8000/auth/validate-session", {
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
