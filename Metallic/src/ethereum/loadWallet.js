import AsyncStorage from "@react-native-async-storage/async-storage";

// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";

// Import the ethers library
import { ethers } from "ethers";

export async function loadWalletFromPrivate() {
    try {
        const storedPrivate = await AsyncStorage.getItem("privateKey");
        const loadedWallet = new ethers.Wallet(storedPrivate);

        return loadedWallet;
    } catch (exception) {
        console.log("ERROR LOADING WALLET");
    }
}

export async function loadMnemonic() {
    try {
        const storedMnemonic = await AsyncStorage.getItem("mnemonic");
        return storedMnemonic;
    } catch (exception) {
        console.log("ERROR LOADING WALLET");
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
