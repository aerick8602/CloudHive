import axios from "axios";

export const fetchSession = async () => {
  const res = await axios.get("/auth/verify");
  return res.data.success as boolean;
};

export const logoutUser = async () => {
  try {
    await axios.post("/auth/logout");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
