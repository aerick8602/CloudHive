export interface StorageInfo {
  limit: string;
  usage: string;
  usageInDrive: string;
  usageInDriveTrash: string;
  user: {
    displayName: string;
    emailAddress: string;
    photoLink: string;
  };
  error?: string;
}
