import { firebase } from "./config";
import * as WalletFunctions from "../ethereum/walletFunctions";

export async function firebaseLogin(email, password) {
    var errorMesasage = "";

    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        WalletFunctions.clearKeysNotForThisUser();
    } catch (error) {
        errorMesasage += error;
    }

    return errorMesasage;
}

export async function firebaseCreateAccountAndLogIn(
    email,
    password,
    name,
    userName,
    address
) {
    var errorMessage = "";
    const db = firebase.firestore();
    const snapshot = await db
        .collection("users")
        .where("userName", "==", userName)
        .get();

    if (!snapshot.empty) {
        errorMessage += "Username Already Taken.\n";
    }

    const snapshot2 = await db
        .collection("users")
        .where("email", "==", email)
        .get();

    if (!snapshot2.empty) {
        errorMessage += "Email Already In Use.\n";
    }

    if (errorMessage == "") {
        try {
            var response = await firebase
                .auth()
                .createUserWithEmailAndPassword(email, password);

            const uid = response.user.uid;
            const usersRef = firebase.firestore().collection("users");
            try {
                await usersRef.doc(uid).set({
                    id: uid,
                    email: email,
                    fullName: name,
                    userName: userName,
                    address: address,
                });

                await usersRef.doc(uid).collection("Contacts").doc(name).set({
                    userName: userName,
                    fullName: name,
                    email: email,
                });

                WalletFunctions.clearKeysNotForThisUser();
            } catch (error) {
                errorMessage += error + "\n";
            }
        } catch (error) {
            errorMessage += error + "\n";
        }
    }

    console.log(errorMessage);
    return errorMessage;
}
