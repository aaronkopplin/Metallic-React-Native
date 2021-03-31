import React, { useState } from "react";
import {
    Image,
    Text,
    View,
    Dimensions,
    Platform,
    Alert,
    Button,
    TextInput,
} from "react-native";
import CustomButton from "../../../button";
import { masterStyles } from "../../../../Metallic/masterStyles";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase } from "../../firebase/config";

// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";

// Import the ethers library
import { ethers } from "ethers";

export function AccountRecoveryScreen() {
    const screenSize =
        Platform.OS === "web"
            ? Dimensions.get("window")
            : Dimensions.get("screen");
    const navigation = useNavigation();
    const [mnemonic, setMnemonic] = useState("");

    const storeData = async (key, value) => {
        try {
            var user = firebase.auth().currentUser;
            var doc = await firebase
                .firestore()
                .collection("users")
                .doc(user.uid)
                .get();
            var userName = doc.data().userName;
            await AsyncStorage.setItem(userName + key, value);
        } catch (e) {
            // saving error
        }
    };

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
                <TextInput
                    style={[
                        masterStyles.input,
                        { width: screenSize.width - 60 },
                    ]}
                    placeholder="Mnemonic"
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setMnemonic(text)}
                    // value={fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="words"
                    autoCompleteType="off"
                    autoCorrect={false}
                />
                <CustomButton
                    onPress={() => {
                        try {
                            async function verifyAccountMnemonic() {
                                Alert.alert(
                                    "Loading",
                                    "Please wait while we recover your account. This could take up to 10 seconds.",
                                    [
                                        {
                                            text: "Ok",
                                            onPress: () => {},
                                            style: "Cancel",
                                        },
                                    ]
                                );
                                const newWallet = await ethers.Wallet.fromMnemonic(
                                    mnemonic
                                );
                                var user = firebase.auth().currentUser;
                                var doc = await firebase
                                    .firestore()
                                    .collection("users")
                                    .doc(user.uid)
                                    .get();
                                var oldAddress = doc.data().address;
                                console.log(
                                    "recovered address: ",
                                    newWallet.address,
                                    "old address: ",
                                    oldAddress
                                );
                                if (newWallet.address == oldAddress) {
                                    storeData(
                                        "mnemonic",
                                        newWallet.mnemonic.phrase
                                    );
                                    storeData(
                                        "privateKey",
                                        newWallet.privateKey
                                    );
                                    navigation.navigate("Account");
                                } else {
                                    Alert.alert(
                                        "Error",
                                        "The ethereum wallet you are recovering does not match the wallet that is linked to this account." +
                                            "\n\nPleaase log into the account that this wallet is registered under.",
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
                            verifyAccountMnemonic();
                        } catch (error) {
                            console.log("There was an error");
                        }
                    }}
                    text="Recover Account"
                    color="#1e1c21"
                    width={screenSize.width - 80}
                    height={screenSize.height / 20}
                ></CustomButton>
            </View>
            <View style={(masterStyles.mainBackground, { flex: 0.5 })}></View>
        </View>
    );
}
