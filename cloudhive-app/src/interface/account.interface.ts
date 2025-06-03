export interface Account {
  _id?: string;
  e: string; // email
  c: boolean; // connected status
  a: boolean; // active status
  at: string; // access token
  rt: string; // refresh token
  atv: string | null; // access token expiry (ISO string or custom format)
  rtv: string | null; // refresh token expiry (ISO string or custom format)
  // q: {
  //   l: number; // quota limit
  //   u: number; // quota usage
  // } | null;
  uids: string[]; // Firebase UIDs linked to this account
  sync: number; // last sync timestamp (ms)
}
