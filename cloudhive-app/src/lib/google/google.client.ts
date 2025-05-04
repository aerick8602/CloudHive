import { google } from "googleapis";
import { validateAccessToken } from "./google.token";
import { oauth2Client } from "./google.oauth2";

// Initialize the OAuth2 client
export async function createOAuthClient(email: string) {
  // First, validate the access token and ensure it's refreshed if needed
  // This handles Redis + Mongo + refresh logic internally
  const accessToken = await validateAccessToken(email); // Get a valid access token

  // const oauth2Client = new google.auth.OAuth2(
  //   process.env.GOOGLE_CLIENT_ID!,
  //   process.env.GOOGLE_CLIENT_SECRET!,
  //   process.env.GOOGLE_REDIRECT_URI!
  // );

  // Set the access token
  oauth2Client.setCredentials({ access_token: accessToken });

  // Create the Google Drive client
  const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
  });

  return drive;
}
