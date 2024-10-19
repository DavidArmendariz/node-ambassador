import { firebaseApp } from "./firebase";

export const registerFirebaseUser = async ({
  password,
  email,
  first_name,
  last_name,
  is_ambassador,
}: {
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  is_ambassador: boolean;
}) => {
  try {
    const firebaseRecord = await firebaseApp.auth().createUser({
      email: email,
      password: password,
      displayName: `${first_name} ${last_name}`,
    });

    const claims = { is_ambassador: is_ambassador };
    await firebaseApp.auth().setCustomUserClaims(firebaseRecord.uid, claims);
  } catch (error) {
    console.error(
      "Error creating user or setting custom claims:",
      error.message
    );
  }
};