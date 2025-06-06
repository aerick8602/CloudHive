import admin from "firebase-admin";

// Firebase Service Account (for server-side)
const firebaseServiceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT)
  : null;

// Fix for private_key: convert \\n to actual newlines
if (firebaseServiceAccount?.private_key) {
  firebaseServiceAccount.private_key =
    firebaseServiceAccount.private_key.replace(/\\n/g, "\n");
}

// Initialize Admin SDK
let adminApp: admin.app.App;
if (admin.apps.length === 0 && firebaseServiceAccount) {
  adminApp = admin.initializeApp({
    credential: admin.credential.cert(firebaseServiceAccount),
  });
} else {
  adminApp = admin.app();
}

export const adminAuth = admin.auth(adminApp);
