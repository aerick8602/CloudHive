export const getFirebaseErrorMessage = (code: string): string => {
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already in use.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
      return "No user found with this email.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/missing-email":
      return "Email is required.";
    case "auth/missing-password":
      return "Password is required.";
    case "auth/invalid-credential":
      return "Invalid credentials. Please try again.";
    case "auth/invalid-login-credentials":
      return "Email or password is incorrect.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/internal-error":
      return "Something went wrong. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completing. Please try again.";
    case "auth/popup-blocked":
      return "Popup was blocked by your browser. Please allow popups and try again.";
    case "auth/operation-not-allowed":
      return "This sign-in method is currently disabled.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with a different sign-in method.";
    case "auth/expired-action-code":
      return "This action link has expired. Please request a new one.";
    case "auth/invalid-action-code":
      return "The action link is invalid. Please try again.";
    case "auth/user-token-expired":
      return "Your session has expired. Please log in again.";
    case "auth/requires-recent-login":
      return "Please log in again to perform this action.";
    case "auth/credential-already-in-use":
      return "This credential is already associated with another account.";
    case "auth/email-change-needs-verification":
      return "Please verify your new email address to complete the change.";
    case "auth/provider-already-linked":
      return "This provider is already linked to your account.";
    case "auth/no-such-provider":
      return "No such provider found for this user.";
    case "auth/invalid-verification-code":
      return "The verification code is invalid.";
    case "auth/invalid-verification-id":
      return "The verification ID is invalid.";
    default:
      console.error("Unhandled Firebase error code:", code);
      return "An unexpected error occurred. Please try again.";
  }
};
