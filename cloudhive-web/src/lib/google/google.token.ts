import { google } from "googleapis";
import { getTokenFromMongo, updateTokenToMongo } from "../db/mongo.token";

export async function validateAccessToken(email: string) {
  console.log(`[validateAccessToken] Checking token for email: ${email}`);

  // Get the stored token from the database
  const token = await getTokenFromMongo(email);

  if (!token) {
    console.error(`[validateAccessToken] No token found for email: ${email}`);
    throw new Error("Token not found");
  }

  const currentTime = Date.now();
  const tokenExpiry = token.expiryDate;

  console.log(
    `[validateAccessToken] Current time: ${currentTime}, Token expiry time: ${tokenExpiry}`
  );

  // Check if the token is expired (we set a buffer to avoid refresh requests too frequently)
  if (currentTime > tokenExpiry - 5 * 60 * 1000) {
    console.log(
      `[validateAccessToken] Token expired or about to expire, refreshing token for email: ${email}`
    );
    // Token is expired or nearly expired, refresh it using the refresh token
    return await refreshAccessToken(token.refreshToken, email);
  }

  console.log(`[validateAccessToken] Token still valid for email: ${email}`);

  // If token is still valid, no need to refresh
  return token.accessToken;
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
    // Using 'any' to avoid the TypeScript issue
    const response: any = await oauth2Client.refreshAccessToken();

    console.log(
      `[refreshAccessToken] New access token obtained for email: ${email}`
    );

    const accessToken = response.access_token!;
    const expiryDate = Date.now() + response.expiry_date!;

    console.log(
      `[refreshAccessToken] New token expiry date calculated: ${expiryDate}`
    );

    // Update the new token and expiry date in the database
    await updateTokenToMongo(email, accessToken, expiryDate);

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
