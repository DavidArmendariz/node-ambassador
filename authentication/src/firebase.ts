import admin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
  readFileSync("serviceAccountKey.json", "utf8")
);

export const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
