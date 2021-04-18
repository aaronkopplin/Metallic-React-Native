import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase } from "../firebase/config";

// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";

// Import the ethers library
import { ethers } from "ethers";

export async function createRandomWalletAndWriteToStorage(userName) {
    var wallet = ethers.Wallet.createRandom();
    await storeData(userName, "mnemonic", wallet.mnemonic.phrase);
    await storeData(userName, "privateKey", wallet.privateKey);

    return wallet;
}

export async function clearKeysNotForThisUser() {
    var userName = await getUsername();

    AsyncStorage.getAllKeys()
        .then((keys) => {
            if (keys == null) {
                console.log("COULD NOT LOCATE KEYS");
            } else {
                // located the keys

                if (userName && userName.length > 0) {
                    keys.forEach((key) => {
                        if (key.substring(0, userName.length) != userName) {
                            //this key is not associated with the logged in user
                            console.log("removing data for key: " + key);
                            AsyncStorage.removeItem(key);
                        }
                    });
                }
            }
        })
        .catch((error) => console.log("error getting all keys: " + error));
}

async function getUsername() {
    var user = firebase.auth().currentUser;
    var doc = await firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get();
    var userName = doc.data().userName;
    return userName;
}

export async function storeData(userName, key, value) {
    try {
        console.log("storing data for " + userName);
        await AsyncStorage.setItem(userName + key, value);
    } catch (error) {
        console.log("ERROR STORING DATA: " + error);
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
    const storedPrivate = await AsyncStorage.getItem(userName + key);
    return storedPrivate;
}

export async function loadWalletFromPrivate() {
    try {
        const storedPrivate = await getData("privateKey");
        const loadedWallet = new ethers.Wallet(storedPrivate);
        return loadedWallet;
    } catch (exception) {
        console.log("error loading wallet from private: " + exception);
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
    try {
        var response = await wallet.sendTransaction(transaction);
        console.log(response);
        return "";
    } catch (error) {
        console.log(error);
        return "";
    }
}
