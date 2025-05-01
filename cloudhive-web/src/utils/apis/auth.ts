import axiosInstance from "@/lib/axios";

// Verify user session
export const fetchSession = async () => {
  const res = await axiosInstance.get("/auth/verify");
  return res.data.success as boolean;
};

export const logoutUser = async () => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
