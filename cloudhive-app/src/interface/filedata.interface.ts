export interface FileData {
  // id: string;
  // e: string; // email (user identifier)
  // n: string; // name of the file or folder
  // m: string; // mimeType of the item
  // p: string[]; // parent folder IDs
  // s: boolean; // whether the item is starred
  // t: boolean; // whether the item is trashed
  // ct: string; // createdTime (ISO format)
  // mt: string; // modifiedTime (ISO format)

  // permissions: {
  //   pid: string; // permission ID
  //   pt: string; // e.g., "user", "group", "domain", "anyone"
  //   pe?: string | null; // email address (if type is "user" or "group")
  //   pr: string; // e.g., "reader", "writer", "commenter"
  // }[]; // array of permission objects (optional)

  // q?: number; // quotaBytesUsed (files only, optional)

  id: string;
  email: string;
  name: string;
  mimeType: string;
  parents: string[];
  starred: boolean;
  trashed: boolean;
  createdTime: string;
  modifiedTime: string;
  permissions: {
    id: string;
    type: string;
    role: string;
    emailAddress?: string | null;
    displayName?: string | null;
    photoLink?: string | null;
  }[];
  quotaBytesUsed?: number;
  owners?: { emailAddress: string }[];
}
