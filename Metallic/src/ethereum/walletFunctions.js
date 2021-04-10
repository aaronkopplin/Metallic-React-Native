import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase } from "../firebase/config";

// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";

// Import the ethers library
import { ethers, utils } from "ethers";
import { TransactionDescription } from "ethers/lib/utils";

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
        console.log("address: " + loadedWallet.address);
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

export async function getBalanceFromAddress(address) {
    // allow to get balance
    const provider = new ethers.providers.InfuraProvider(
        "ropsten",
        "298080f1923540f19af74e5baa886001"
    );

    const balance = await provider.getBalance(address);
    return balance;
}

export async function sendPayment(wallet, amount, recipientAddress) {
    if (wallet == null || amount == null || recipientAddress == null) {
        console.log("wallet, amount or recipient address was null");
    }

    const provider = new ethers.providers.InfuraProvider(
        "ropsten",
        "298080f1923540f19af74e5baa886001"
    );

    var transaction = {
        to: recipientAddress,
        value: "0x" + (amount * 1000000000000000000).toString(16),
        chainId: provider.network.chainId,
    };

    wallet = wallet.connect(provider);
    wallet.sendTransaction(transaction).then((response) => {
        console.log(response);
    });
}
