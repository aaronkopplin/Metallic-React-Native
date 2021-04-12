import React, { useState } from "react";
import {
    Image,
    Text,
    TextInput,
    View,
    Dimensions,
    Platform,
    KeyboardAvoidingView,
} from "react-native";
import { firebase } from "../../firebase/config";
import CustomButton from "../../../button";
import { masterStyles } from "../../../../Metallic/masterStyles";
import * as WalletFunctions from "../../ethereum/walletFunctions";

export function login(email, password, wallet) {
    async function storeDataAsync(key, value) {
        await WalletFunctions.storeData(key, value);
    }

    if (wallet) {
        storeDataAsync("mnemonic", wallet.mnemonic.phrase);
        storeDataAsync("privateKey", wallet.privateKey);
    }

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
                        alert("User does not exist anymore.");
                        return;
                    }
                    const user = firestoreDocument.data();
                    WalletFunctions.clearKeysNotForThisUser();
                })
                .catch((error) => {
                    alert(error);
                });
        })
        .catch((error) => {
            alert(error);
        });
}

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const screenSize =
        Platform.OS === "web"
            ? Dimensions.get("window")
            : Dimensions.get("screen");
    const onFooterLinkPress = () => {
        navigation.navigate("Registration");
    };

    const onLoginPress = () => {
        console.log("Login Button Pressed.");
        login(email, password, null);
    };

    return (
        <View style={masterStyles.mainBackground} justifyContent="flex-start">
            <Image
                style={masterStyles.logo}
                source={require("../../../assets/metalliclogo.png")}
            />

            <KeyboardAvoidingView
                behavior="padding"
                enabled
                style={{
                    // flex: 3,
                    backgroundColor: "#2e2b30",
                    width: screenSize.width - 20,
                    // height:
                    //     Platform.OS === "web"
                    //         ? screenSize.height / 2.5
                    //         : screenSize.width - 30,
                    paddingTop: screenSize.height / 50,
                    paddingLeft: 20,
                    borderRadius: 4,
                }}
            >
                <Text
                    style={[
                        masterStyles.headingsSmall,
                        {
                            paddingTop: screenSize.height * 0.01,
                            paddingBottom: screenSize.height * 0.005,
                        },
                    ]}
                >
                    E-Mail
                </Text>

                <TextInput
                    style={[
                        masterStyles.input,
                        { width: screenSize.width - 60 },
                    ]}
                    placeholder="Enter your e-mail"
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
                    keyboardType={"email-address"}
                />

                <Text
                    style={[
                        masterStyles.headingsSmall,
                        {
                            paddingTop: screenSize.height * 0.01,
                            paddingBottom: screenSize.height * 0.005,
                        },
                    ]}
                >
                    Password
                </Text>

                <TextInput
                    style={[
                        masterStyles.input,
                        { width: screenSize.width - 60 },
                    ]}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder="Enter your password"
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
                />
                <Text></Text>

                <CustomButton
                    onPress={onLoginPress}
                    text="Login"
                    color="#1e1c21"
                    width={screenSize.width - 60}
                    height={screenSize.height / 20}
                />
                <Text></Text>

                <CustomButton
                    onPress={onFooterLinkPress}
                    text={"Don't have an account?"}
                    color="#1e1c21"
                    width={screenSize.width - 60}
                    height={screenSize.height / 20}
                />
                <Text></Text>
            </KeyboardAvoidingView>
        </View>
    );
}
