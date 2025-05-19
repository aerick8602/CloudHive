export interface FileData {
  id: string;
  email: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  parents: string[];
  starred: boolean;
  trashed: boolean;
  createdTime: string;
  modifiedTime: string;
  viewedByMe: boolean;
  viewedByMeTime: string;
  permissions: {
    id: string;
    type: string;
    role: string;
    emailAddress?: string | null;
    displayName?: string | null;
    photoLink?: string | null;
  }[];
  quotaBytesUsed?: number;
  owners?: {
    emailAddress: string;
    displayName?: string | null;
    photoLink?: string | null;
  }[];
}
