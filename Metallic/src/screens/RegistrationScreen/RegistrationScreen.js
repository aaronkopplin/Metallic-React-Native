import React, { useState } from "react";
import {
    Image,
    Text,
    TextInput,
    View,
    Dimensions,
    Platform,
} from "react-native";
import { firebase } from "../../firebase/config";
import { login } from "../LoginScreen/LoginScreen";
import CustomButton from "../../../button";
import { masterStyles } from "../../../../Metallic/masterStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";

// Import the ethers library
import { ethers } from "ethers";

export default function RegistrationScreen({ navigation }) {
    // state
    const [fullName, setFullName] = useState("");
    const [user_email, setEmail] = useState("");
    const [user_password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userName, setUserName] = useState("");

    const screenSize =
        Platform.OS === "web"
            ? Dimensions.get("window")
            : Dimensions.get("screen");
    const onFooterLinkPress = () => {
        console.log("Already Have Account Pressed");
        navigation.navigate("Login");
    };

    const storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (e) {
            // saving error
        }
    };

    const onRegisterPress = async () => {
        console.log("Create Account Pressed.");
        const db = firebase.firestore();

        if (user_password !== confirmPassword) {
            alert("Passwords don't match.");
            return;
        }

        const snapshot = await db
            .collection("users")
            .where("userName", "==", userName)
            .get();

        if (!snapshot.empty) {
            alert("Username Already Taken!");
            return;
        }

        // create the eth account
        const newWallet = ethers.Wallet.createRandom();
        console.log("created new account from random");
        storeData("mnemonic", newWallet.mnemonic.phrase);
        storeData("privateKey", newWallet.privateKey);

        firebase
            .auth()
            .createUserWithEmailAndPassword(user_email, user_password)
            .then((response) => {
                const uid = response.user.uid;
                const data = {
                    id: uid,
                    email: user_email,
                    fullName: fullName,
                    userName: userName,
                    address: newWallet.address,
                };

                const data2 = {
                    userName,
                    fullName,
                    email: user_email,
                };

                const usersRef = firebase.firestore().collection("users");
                if (!snapshot.empty) {
                    alert("Username already taken.");
                } else {
                    usersRef
                        .doc(uid)
                        .set(data)
                        .then(() => {
                            console.log("Attempting to navigate to home");
                        })
                        .catch((error) => {
                            console.log("error caught in firebase.");
                            alert(error);
                        });

                    usersRef
                        .doc(uid)
                        .collection("Contacts")
                        .doc(data.fullName)
                        .set(data2);
                }
            })
            .catch((error) => {
                alert(error);
            })
            .then(() => {
                console.log("Hoes mad");
                login(user_email, user_password);
            });
    };

    return (
        <View style={masterStyles.mainBackground}>
            <Image
                style={[masterStyles.logo, { flex: 0.75 }]}
                source={require("../../../assets/metalliclogo.png")}
            />

            <View
                style={{
                    flex: 5,
                    backgroundColor: "#2e2b30",
                    width: screenSize.width - 20,
                    height:
                        Platform.OS === "web"
                            ? screenSize.height / 2.5
                            : screenSize.height / 2.5,
                    paddingTop: screenSize.height / 50,
                    paddingLeft: 20,
                    borderRadius: 4,
                }}
            >
                <Text
                    style={[
                        masterStyles.headingsSmall,
                        { paddingBottom: screenSize.height * 0.005 },
                    ]}
                >
                    Name
                </Text>

                <TextInput
                    style={[
                        masterStyles.input,
                        { width: screenSize.width - 60 },
                    ]}
                    placeholder="Full Name"
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setFullName(text)}
                    value={fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="words"
                    autoCompleteType="off"
                    autoCorrect={false}
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
                    E-Mail
                </Text>

                <TextInput
                    style={[
                        masterStyles.input,
                        { width: screenSize.width - 60 },
                    ]}
                    placeholder="E-mail"
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={user_email}
                    keyboardType="email-address"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
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
                    Username
                </Text>

                <TextInput
                    style={[
                        masterStyles.input,
                        { width: screenSize.width - 60 },
                    ]}
                    placeholderTextColor="#aaaaaa"
                    placeholder="Username"
                    onChangeText={(text) => setUserName(text)}
                    value={userName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
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
                    placeholder="Password"
                    onChangeText={(text) => setPassword(text)}
                    value={user_password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
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
                    Confirm Password
                </Text>

                <TextInput
                    style={[
                        masterStyles.input,
                        { width: screenSize.width - 60 },
                    ]}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder="Confirm Password"
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
                />
                <View
                    style={{
                        zIndex: 1,
                        paddingTop: screenSize.height / 20,
                        paddingBottom: screenSize.height / 70,
                    }}
                >
                    <CustomButton
                        onPress={onRegisterPress}
                        text="Create Account"
                        color="#1e1c21"
                        width={screenSize.width - 60}
                        height={screenSize.height / 20}
                    />
                </View>
                <View style={masterStyles.footerView}>
                    <Text style={masterStyles.footerText}>
                        Already got an account?{" "}
                        <Text
                            onPress={onFooterLinkPress}
                            style={masterStyles.footerLink}
                        >
                            Log in
                        </Text>
                    </Text>
                </View>
            </View>

            <View style={(masterStyles.mainBackground, { flex: 0.5 })}></View>
        </View>
    );
}
