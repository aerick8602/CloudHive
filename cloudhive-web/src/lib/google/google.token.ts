import { google } from "googleapis";
import { getTokenFromMongo, updateTokenToMongo } from "../db/mongo.token";
import { convertISTToMillis, convertMillisToIST } from "@/utils/time";

export async function validateAccessToken(email: string) {
  console.log(`[validateAccessToken] Checking token for email: ${email}`);

  // Get the stored token from the database
  const token = await getTokenFromMongo(email);

  if (!token) {
    console.error(`[validateAccessToken] No token found for email: ${email}`);
    throw new Error("Token not found");
  }

  const currentTime = Date.now();
  const tokenExpiry = convertISTToMillis(token.atv!);

  console.log(
    `[validateAccessToken] Current time: ${currentTime}, Token expiry time: ${tokenExpiry}`
  );

  // Check if the token is expired (we set a buffer to avoid refresh requests too frequently)
  if (currentTime > tokenExpiry - 5 * 60 * 1000) {
    console.log(
      `[validateAccessToken] Token expired or about to expire, refreshing token for email: ${email}`
    );
    // Token is expired or nearly expired, refresh it using the refresh token
    return await refreshAccessToken(token.rt!, email);
  }

  console.log(`[validateAccessToken] Token still valid for email: ${email}`);

  // If token is still valid, no need to refresh
  return token.at;
}

// Function to refresh the access token using the refresh token
export async function refreshAccessToken(refreshToken: string, email: string) {
  console.log(
    `[refreshAccessToken] Refreshing access token for email: ${email}`
  );

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const response: any = await oauth2Client.refreshAccessToken();
    console.log("Token Response :", response);
    console.log(
      `[refreshAccessToken] New access token obtained for email: ${email}`
    );

    // Fix: read from response.credentials
    const accessToken = response.credentials.access_token!;
    const accessExpiry = convertMillisToIST(response.credentials.expiry_date!);
    const refreshExpiry = convertMillisToIST(
      Date.now() + response.credentials.refresh_token_expires_in! * 1000
    );

    console.log(
      `[refreshAccessToken] New token expiry date calculated: ${accessExpiry}`
    );

    await updateTokenToMongo(email, accessToken, accessExpiry, refreshExpiry);

    console.log(
      `[refreshAccessToken] Updated token in MongoDB for email: ${email}`
    );

    return accessToken;
  } catch (error) {
    console.error(
      `[refreshAccessToken] Error refreshing access token for email: ${email}`,
      error
    );
    throw new Error("Failed to refresh access token");
  }
}
