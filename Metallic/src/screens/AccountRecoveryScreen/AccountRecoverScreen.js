import React, { useState } from "react";
import {
    Text,
    View,
    Dimensions,
    Platform,
    Alert,
    TextInput,
} from "react-native";
import CustomButton from "../../../button";
import { masterStyles } from "../../../../Metallic/masterStyles";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../../firebase/config";
import * as WalletFunctions from "../../ethereum/walletFunctions";

// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";

// Import the ethers library
import { ethers } from "ethers";

async function verifyAccountMnemonic(mnemonic, navigation) {
    Alert.alert("Warning", "This could take up to 10 seconds.", [
        {
            text: "Continue",
            onPress: () => {
                recoverAccount(mnemonic, navigation);
            },
            style: "Cancel",
        },
    ]);
}

async function recoverAccount(mnemonic, navigation) {
    const newWallet = ethers.Wallet.fromMnemonic(mnemonic);
    var user = firebase.auth().currentUser;
    var doc = await firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get();
    var oldAddress = doc.data().address;
    console.log(
        "recovered address: " +
            newWallet.address +
            " old address: " +
            oldAddress
    );
    if (newWallet.address == oldAddress) {
        WalletFunctions.storeData("mnemonic", newWallet.mnemonic.phrase);
        WalletFunctions.storeData("privateKey", newWallet.privateKey);
        navigation.navigate("ViewOtherAccount");
    } else {
        Alert.alert(
            "Error",
            "The ethereum wallet you are recovering does not match the wallet that is linked to this account." +
                "\n\nPlease log into the account that this wallet is registered under.",
            [
                {
                    text: "Ok",
                    onPress: () => {},
                    style: "Cancel",
                },
            ]
        );
    }
}

export function AccountRecoveryScreen() {
    const screenSize =
        Platform.OS === "web"
            ? Dimensions.get("window")
            : Dimensions.get("screen");
    const navigation = useNavigation();
    const [mnemonic, setMnemonic] = useState("");

    // alert(
    //     "The wallet for the account you are accessing was not found on this device. Plase recover your account with the mnemonic phrase from this account."
    // );

    return (
        <View style={masterStyles.mainBackground}>
            <View style={(masterStyles.mainBackground, { flex: 0.5 })}></View>
            <View
                style={{
                    flex: 4,
                    backgroundColor: "#2e2b30",
                    width: screenSize.width - 40,
                    height:
                        Platform.OS === "web"
                            ? screenSize.height / 2.5
                            : screenSize.width - 30,
                    paddingTop: screenSize.height / 50,
                    alignItems: "center",
                    borderRadius: 4,
                }}
            >
                <Text
                    style={[
                        masterStyles.headingsSmall,
                        {
                            paddingBottom: screenSize.height * 0.005,
                            textAlign: "center",
                        },
                    ]}
                >
                    Enter the mnemonic phrase for the account that you wish to
                    recover below.
                </Text>
                <Text></Text>
                <TextInput
                    style={[
                        masterStyles.input,
                        { width: screenSize.width - 80 },
                    ]}
                    placeholder="Mnemonic"
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setMnemonic(text.toLowerCase())}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
                />
                <Text></Text>
                <CustomButton
                    onPress={() => {
                        try {
                            verifyAccountMnemonic(mnemonic, navigation);
                        } catch (error) {
                            console.log("There was an error");
                        }
                    }}
                    text="Recover Account"
                    color="#1e1c21"
                    width={screenSize.width - 80}
                    height={screenSize.height / 20}
                ></CustomButton>
                <Text></Text>
                <CustomButton
                    onPress={() => {
                        firebase
                            .auth()
                            .signOut()
                            .then(() => {})
                            .catch((error) => {
                                console.log(error);
                            });
                    }}
                    text="Log Out"
                    color="#1e1c21"
                    width={screenSize.width - 80}
                    height={screenSize.height / 20}
                ></CustomButton>
            </View>
            <View style={(masterStyles.mainBackground, { flex: 0.5 })}></View>
        </View>
    );
}
