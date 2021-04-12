import React, { useState } from "react";
import {
    Image,
    Text,
    TextInput,
    View,
    Dimensions,
    Platform,
    KeyboardAvoidingView,
    Alert,
} from "react-native";
import { firebase } from "../../firebase/config";
import { login } from "../LoginScreen/LoginScreen";
import CustomButton from "../../../button";
import { masterStyles } from "../../../../Metallic/masterStyles";
import { useEffect } from "react";

// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";

// Import the ethers library
import { ethers } from "ethers";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

async function createAccount(
    fullName,
    user_email,
    user_password,
    userName,
    setLoadingMessge
) {
    const db = firebase.firestore();
    const snapshot = await db
        .collection("users")
        .where("userName", "==", userName)
        .get();

    if (!snapshot.empty) {
        alert("Username Already Taken!");
        return;
    }

    const snapshot2 = await db
        .collection("users")
        .where("email", "==", user_email)
        .get();

    if (!snapshot2.empty) {
        alert("Email Already In Use!");
        return;
    }

    // alert("Please wait while we create your account.");
    const newWallet = ethers.Wallet.createRandom();

    await firebase
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
                address: newWallet.address,
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
                        // alert(error);
                    });

                usersRef
                    .doc(uid)
                    .collection("Contacts")
                    .doc(data.fullName)
                    .set(data2);
            }
        })
        .catch((error) => {
            console.log(error);
            // alert(error);
            setLoadingMessge("Please go back and try again.");
        })
        .then(() => {
            login(user_email, user_password, newWallet);
        });
}

export default function RegistrationScreen({ navigation }) {
    // state
    const [fullName, setFullName] = useState("");
    const [userEmail, setEmail] = useState("");
    const [userPassword, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(
        "Your account is being created..."
    );

    const screenSize =
        Platform.OS === "web"
            ? Dimensions.get("window")
            : Dimensions.get("screen");
    const onFooterLinkPress = () => {
        navigation.navigate("Login");
    };

    // const storeData = async (key, value) => {
    //     try {
    //         var user = firebase.auth().currentUser;
    //         var doc = await firebase
    //             .firestore()
    //             .collection("users")
    //             .doc(user.uid)
    //             .get();
    //         var userName = doc.data().userName;
    //         await AsyncStorage.setItem(userName + key, value);
    //     } catch (e) {
    //         // saving error
    //     }
    // };

    const onRegisterPress = async () => {
        if (fullName == "") {
            alert("Please enter a name for the account.");
            return;
        }

        if (userEmail == "") {
            alert("Please enter an email for the account.");
            return;
        }

        if (userPassword == "") {
            alert("Please enter a password.");
            return;
        }

        if (confirmPassword == "") {
            alert("Please confirm password.");
            return;
        }

        if (userName == "") {
            alert("Please enter a username for the account.");
            return;
        }

        if (userPassword !== confirmPassword) {
            alert("Passwords don't match.");
            return;
        }

        Alert.alert(
            "Creating Account",
            "Account creation will take a few seconds, sit tight.",
            [
                {
                    text: "Got it",
                    onPress: () => {
                        setLoading(true);
                        createAccount(
                            fullName,
                            userEmail,
                            userPassword,
                            userName,
                            setLoadingMessage
                        );
                    },
                    style: "cancel",
                },
            ]
        );
    };

    return loading ? (
        <View style={masterStyles.mainBackground} justifyContent="flex-start">
            <Image
                style={[masterStyles.logo]}
                source={require("../../../assets/metalliclogo.png")}
            />
            <Text
                style={[
                    masterStyles.headingsSmall,
                    { paddingBottom: screenSize.height * 0.005 },
                ]}
            >
                {loadingMessage}
            </Text>
        </View>
    ) : (
        <View style={masterStyles.mainBackground} justifyContent="flex-start">
            <Image
                style={[masterStyles.logo]}
                source={require("../../../assets/metalliclogo.png")}
            />

            <KeyboardAwareScrollView
                style={{
                    flex: 1,
                    backgroundColor: "#2e2b30",
                    width: screenSize.width - 20,

                    // height:
                    //     Platform.OS === "web"
                    //         ? screenSize.height / 2.5
                    //         : screenSize.height * 0.75,
                    // paddingTop: screenSize.height / 50,
                    paddingLeft: 20,
                    borderRadius: 4,
                }}
                justifyContent="flex-start"
            >
                <Text></Text>
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
                    value={userEmail}
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
                    value={userPassword}
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
                <Text></Text>

                <CustomButton
                    onPress={onRegisterPress}
                    text="Create Account"
                    color="#1e1c21"
                    width={screenSize.width - 60}
                    height={screenSize.height / 20}
                />

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
            </KeyboardAwareScrollView>

            <View style={(masterStyles.mainBackground, { flex: 0.1 })}></View>
        </View>
    );
}
