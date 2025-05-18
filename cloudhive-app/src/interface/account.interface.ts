export interface Account {
  e: string; // email
  at: string; // access token
  rt: string; // refresh token
  atv: string | null; // access token expiry (ISO string or custom format)
  rtv: string | null; // refresh token expiry (ISO string or custom format)
  sync: number; // last sync timestamp (ms)
  q: {
    l: number; // quota limit
    u: number; // quota usage
  } | null;
  uids: string[]; // Firebase UIDs linked to this account
  c: boolean; // connected status
  a: boolean; // active status
}
