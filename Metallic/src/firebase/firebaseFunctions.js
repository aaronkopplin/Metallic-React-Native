import { firebase } from "./config";
import * as WalletFunctions from "../ethereum/walletFunctions";

export async function firebaseLogin(email, password) {
    var errorMesasage = "";

    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((response) => {
            const uid = response.user.uid;
            const usersRef = firebase.firestore().collection("users");
            usersRef
                .doc(uid)
                .get()
                .then((firestoreDocument) => {
                    if (!firestoreDocument.exists) {
                        errorMessage += "User does not exist anymore.\n";
                    }
                    const user = firestoreDocument.data();
                    WalletFunctions.clearKeysNotForThisUser();
                })
                .catch((error) => {
                    errorMesasage = error + "\n";
                });
        })
        .catch((error) => {
            errorMesasage += error + "\n";
        });

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

    // alert("Please wait while we create your account.");
    //const newWallet = ethers.Wallet.createRandom();
    // need to write the wallet to the firebase account

    return errorMessage;
}
