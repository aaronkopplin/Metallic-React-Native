import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase } from "../firebase/config";

// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";

// Import the ethers library
import { ethers } from "ethers";

export async function storeData(key, value) {
    try {
        var user = firebase.auth().currentUser;
        var doc = await firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .get();
        var userName = doc.data().userName;
        console.log("storing data for " + userName);
        await AsyncStorage.setItem(userName + key, value);
    } catch (e) {
        console.log("ERROR STORING DATA");
    }
}

export async function getData(key) {
    var user = firebase.auth().currentUser;
    var doc = await firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get();
    var userName = doc.data().userName;
    console.log("getting data for " + userName);
    const storedPrivate = await AsyncStorage.getItem(userName + key);
    return storedPrivate;
}

export async function loadWalletFromPrivate() {
    try {
        const storedPrivate = await getData("privateKey");
        const loadedWallet = new ethers.Wallet(storedPrivate);
        return loadedWallet;
    } catch (exception) {
        console.log("error loading wallet from private");
    }
}

export async function loadMnemonic() {
    try {
        const storedMnemonic = await getData("mnemonic");
        return storedMnemonic;
    } catch (exception) {
        console.log("error loading wallet from mnemonic");
    }
}

export async function getBalance(wallet) {
    // allow to get balance
    const provider = new ethers.providers.InfuraProvider(
        "ropsten",
        "298080f1923540f19af74e5baa886001"
    );

    const balance = await provider.getBalance(wallet.address);
    return balance;
}
