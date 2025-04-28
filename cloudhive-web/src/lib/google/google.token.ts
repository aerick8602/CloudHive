import { google } from "googleapis";
import { getTokenFromMongo, updateTokenToMongo } from "../db/mongo.token";

export async function validateAccessToken(email: string) {
  // Get the stored token from the database
  const token = await getTokenFromMongo(email);

  if (!token) {
    throw new Error("Token not found");
  }

  const currentTime = Date.now();
  const tokenExpiry = token.expiryDate;

  // Check if the token is expired (we set a buffer to avoid refresh requests too frequently)
  if (currentTime > tokenExpiry - 5 * 60 * 1000) {
    // Token is expired or nearly expired, refresh it using the refresh token
    return await refreshAccessToken(token.refreshToken, email);
  }

  // If token is still valid, no need to refresh
  return token.accessToken;
}

// Function to refresh the access token using the refresh token
export async function refreshAccessToken(refreshToken: string, email: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    // Using 'any' to avoid the TypeScript issue
    const response: any = await oauth2Client.refreshAccessToken();
    const accessToken = response.access_token!;
    const expiryDate = Date.now() + response.expiry_date!;

    // Update the new token and expiry date in the database
    await updateTokenToMongo(email, accessToken, expiryDate);

    return accessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw new Error("Failed to refresh access token");
  }
}
