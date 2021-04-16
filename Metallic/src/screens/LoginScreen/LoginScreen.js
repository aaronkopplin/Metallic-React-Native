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
        <View style={masterStyles.mainView}>
            <Image
                style={masterStyles.logo}
                source={require("../../../assets/metalliclogo.png")}
            />

            <KeyboardAvoidingView
                behavior="padding"
                style={masterStyles.loginKeyboardAvoidView}
            >
                <Text style={masterStyles.mainHeadings}>
                    E-Mail
                </Text>

                <TextInput
                    style={[
                        masterStyles.input,
                        {width: Platform.OS == 'web' ? screenSize.width * .58 : screenSize.width * .85},
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

                <Text style={masterStyles.mainHeadings}>
                    Password
                </Text>

                <TextInput
                    style={[
                        masterStyles.input,
                        { width: Platform.OS == 'web' ? screenSize.width * .58 : screenSize.width * .85},
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
                <View style={{height: screenSize.height * .05}}/>

                <CustomButton
                    onPress={onLoginPress}
                    text="Login"
                    color="#117ed1"
                    width={Platform.OS == 'web' ? screenSize.width * .58 : screenSize.width * .85}
                    height={screenSize.height / 20}
                />
                <View style={{height: screenSize.height * .02}}/>

                <CustomButton
                    onPress={onFooterLinkPress}
                    text={"Don't have an account?"}
                    color="#6111d1"
                    width={Platform.OS == 'web' ? screenSize.width * .58 : screenSize.width * .85}
                    height={screenSize.height / 20}
                />
            </KeyboardAvoidingView>
        </View>
    );
}
