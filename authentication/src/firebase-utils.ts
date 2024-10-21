import { firebaseApp } from "./firebase";

export const registerFirebaseUser = async ({
  password,
  email,
  first_name,
  last_name,
  is_ambassador,
  user_database_id,
}: {
  user_database_id: number;
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

    const claims = { is_ambassador, user_database_id };
    await firebaseApp.auth().setCustomUserClaims(firebaseRecord.uid, claims);
  } catch (error) {
    console.error(
      "Error creating user or setting custom claims:",
      error.message
    );
  }
};

export const updateFirebaseUserPassword = async ({
  uid,
  newPassword,
}: {
  uid: string;
  newPassword: string;
}) => {
  try {
    await firebaseApp.auth().updateUser(uid, {
      password: newPassword,
    });
    console.log("Password updated successfully for user:", uid);
  } catch (error) {
    console.error("Error updating user password:", error.message);
  }
};
