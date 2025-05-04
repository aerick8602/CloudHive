import { ObjectId } from "mongodb";

export interface User {
  uid: string; // Firebase UID
  aids: ObjectId[]; // List of connected Drive account ObjectIds
}
