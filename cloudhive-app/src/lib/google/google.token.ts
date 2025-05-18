// import { google } from "googleapis";
// import { getTokenFromMongo, updateTokenToMongo } from "../db/mongo.token";
// import { convertISTToMillis, convertMillisToIST } from "@/utils/time";

// export async function validateAccessToken(email: string) {
//   console.log(`[validateAccessToken] Checking token for email: ${email}`);

//   // Get the stored token from the database
//   const token = await getTokenFromMongo(email);

//   if (!token) {
//     console.error(`[validateAccessToken] No token found for email: ${email}`);
//     throw new Error("Token not found");
//   }

//   const currentTime = Date.now();
//   const tokenExpiry = convertISTToMillis(token.atv!);

//   console.log(
//     `[validateAccessToken] Current time: ${currentTime}, Token expiry time: ${tokenExpiry}`
//   );

//   // Check if the token is expired (we set a buffer to avoid refresh requests too frequently)
//   if (currentTime > tokenExpiry - 5 * 60 * 1000) {
//     console.log(
//       `[validateAccessToken] Token expired or about to expire, refreshing token for email: ${email}`
//     );
//     // Token is expired or nearly expired, refresh it using the refresh token
//     return await refreshAccessToken(token.rt!, email);
//   }

//   console.log(`[validateAccessToken] Token still valid for email: ${email}`);

//   // If token is still valid, no need to refresh
//   return token.at;
// }

// // Function to refresh the access token using the refresh token
// export async function refreshAccessToken(refreshToken: string, email: string) {
//   console.log(
//     `[refreshAccessToken] Refreshing access token for email: ${email}`
//   );

//   const oauth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID!,
//     process.env.GOOGLE_CLIENT_SECRET!,
//     process.env.GOOGLE_REDIRECT_URI!
//   );

//   oauth2Client.setCredentials({ refresh_token: refreshToken });

//   try {
//     const response: any = await oauth2Client.refreshAccessToken();
//     console.log("Token Response :", response);
//     console.log(
//       `[refreshAccessToken] New access token obtained for email: ${email}`
//     );

//     // Fix: read from response.credentials
//     const accessToken = response.credentials.access_token!;
//     const accessExpiry = convertMillisToIST(response.credentials.expiry_date!);
//     const refreshExpiry = convertMillisToIST(
//       Date.now() + response.credentials.refresh_token_expires_in! * 1000
//     );

//     console.log(
//       `[refreshAccessToken] New token expiry date calculated: ${accessExpiry}`
//     );

//     await updateTokenToMongo(email, accessToken, accessExpiry, refreshExpiry);

//     console.log(
//       `[refreshAccessToken] Updated token in MongoDB for email: ${email}`
//     );

//     return accessToken;
//   } catch (error) {
//     console.error(
//       `[refreshAccessToken] Error refreshing access token for email: ${email}`,
//       error
//     );
//     throw new Error("Failed to refresh access token");
//   }
// }

import { google } from "googleapis";
import { getTokenFromMongo, updateTokenToMongo } from "../db/mongo.token";
import { convertISTToMillis, convertMillisToIST } from "@/utils/time";
import redis from "../cache/redis.config";
import { oauth2Client } from "./google.oauth2";

export async function validateAccessToken(email: string) {
  // console.log(`[validateAccessToken] Checking token for email: ${email}`);

  // Check if token exists in Redis first
  try {
    const cachedToken = await redis.get(`access_token:${email}`);
    if (cachedToken) {
      // console.log(`[validateAccessToken] Cache hit for email: ${email}`);
      return cachedToken;
    }
  } catch (err) {
    console.warn(`[Redis] Failed to fetch access token for ${email}`, err);
  }

  // Fallback: Get token from MongoDB
  const token = await getTokenFromMongo(email);
  if (!token) {
    console.error(`[validateAccessToken] No token found for email: ${email}`);
    throw new Error("Token not found");
  }

  const currentTime = Date.now();
  const tokenExpiry = convertISTToMillis(token.atv!);

  // console.log(
  //   `[validateAccessToken] Current time: ${currentTime}, Token expiry time: ${tokenExpiry}`
  // );

  // Check if token is expired (with 5-minute buffer)
  if (currentTime > tokenExpiry - 5 * 60 * 1000) {
    // console.log(
    //   `[validateAccessToken] Token expired or about to expire, refreshing...`
    // );

    const { accessToken, expiryDate } = await refreshAccessToken(
      token.rt!,
      email
    );

    // Cache refreshed token in Redis
    const ttl = Math.max(Math.floor((expiryDate - Date.now()) / 1000) - 60, 60);
    try {
      await redis.set(`access_token:${email}`, accessToken, "EX", ttl);
    } catch (err) {
      console.warn(`[Redis] Failed to cache refreshed token for ${email}`, err);
    }

    return accessToken;
  }

  // Token is still valid, cache it in Redis
  const ttlInSeconds = Math.max(
    Math.floor((tokenExpiry - currentTime) / 1000) - 60,
    60
  );
  try {
    await redis.set(`access_token:${email}`, token.at!, "EX", ttlInSeconds);
  } catch (err) {
    console.warn(`[Redis] Failed to cache valid token for ${email}`, err);
  }

  return token.at!;
}

export async function refreshAccessToken(
  refreshToken: string,
  email: string
): Promise<{
  accessToken: string;
  expiryDate: number;
}> {
  // console.log(
  //   `[refreshAccessToken] Refreshing access token for email: ${email}`
  // );

  // const oauth2Client = new google.auth.OAuth2(
  //   process.env.GOOGLE_CLIENT_ID!,
  //   process.env.GOOGLE_CLIENT_SECRET!,
  //   process.env.GOOGLE_REDIRECT_URI!
  // );

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const response: any = await oauth2Client.refreshAccessToken();
    const credentials = response.credentials;

    const accessToken = credentials.access_token!;
    const expiryDate = credentials.expiry_date!;
    const accessExpiryIST = convertMillisToIST(expiryDate);

    const refreshExpiryIST = convertMillisToIST(
      Date.now() + credentials.refresh_token_expires_in! * 1000
    );

    // console.log(
    //   `[refreshAccessToken] New token expires at: ${accessExpiryIST}`
    // );

    // Update MongoDB with new token info
    await updateTokenToMongo(
      email,
      accessToken,
      accessExpiryIST,
      refreshExpiryIST
    );

    // console.log(
    //   `[refreshAccessToken] Token updated in MongoDB for email: ${email}`
    // );

    return { accessToken, expiryDate };
  } catch (error) {
    console.error(`[refreshAccessToken] Failed for ${email}`, error);
    throw new Error("Failed to refresh access token");
  }
}
