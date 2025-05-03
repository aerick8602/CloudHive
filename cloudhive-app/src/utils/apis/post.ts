import axios from "axios";

// Logout current user
const logoutUser = (url: string) => axios.post(url);

export { logoutUser };
