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
import "firebase/storage"
import {defaultImage } from "../../../assets/Default_Img.png"

// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";

// Import the ethers library
import { ethers } from "ethers";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

function callLogin(setLoadingMessage, user_email, user_password, newWallet) {
    console.log("Successfully created account");
    setLoadingMessage("Account creation successful.");
    Platform.OS == "web" ? login(user_email, user_password, newWallet) : console.log("not web");
    // setLoading(false);    
}

function displayErrorMessage(error, setLoadingMessage) {
    console.log(error);
    setLoadingMessage(error + "\n\nPlease go back and try again.");
}

async function createAccount(
    fullName,
    user_email,
    user_password,
    userName,
    setLoading,
    setLoadingMessage
) {
    setLoadingMessage("Your account is being created...");

    const db = firebase.firestore();
    const snapshot = await db
        .collection("users")
        .where("userName", "==", userName)
        .get();

    if (!snapshot.empty) {
        setLoadingMessage(
            "Username Already Taken.\n\nPlease go back and try again."
        );
        return;
    }

    const snapshot2 = await db
        .collection("users")
        .where("email", "==", user_email)
        .get();

    if (!snapshot2.empty) {
        setLoadingMessage(
            "Email Already In Use.\n\nPlease go back and try again."
        );
        return;
    }

    // alert("Please wait while we create your account.");
    const newWallet = ethers.Wallet.createRandom();

    await firebase
        .auth()
        .createUserWithEmailAndPassword(user_email, user_password)
        .then(
            (response) => {
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
                usersRef
                    .doc(uid)
                    .set(data)
                    .then(
                        () => {
                            usersRef
                                .doc(uid)
                                .collection("Contacts")
                                .doc(data.fullName)
                                .set(data2)
                                .then(
                                    () => {
                                        callLogin(
                                            setLoadingMessage,
                                            user_email,
                                            user_password,
                                            newWallet
                                        );
                                    },
                                    (error) => {
                                        console.log(error);
                                        setLoadingMessage(
                                            error +
                                                "\n\nPlease go back and try again."
                                        );
                                    }
                                );
                        },
                        (error) => {
                            displayErrorMessage(error, setLoadingMessage);
                        }
                    );
            },
            (error) => {
                displayErrorMessage(error, setLoadingMessage);
            }
        );
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

        setLoading(true);
        
        const newWallet = await createAccount(
            fullName,
            userEmail,
            userPassword,
            userName,
            setLoading,
            setLoadingMessage
        );
        
        Platform.OS != "web" ? login(userEmail, userPassword, newWallet) : console.log("Am Web");
        // Alert.alert(
        //     "Creating Account",
        //     "Account creation will take a few seconds, sit tight.",
        //     [
        //         {
        //             text: "Got it",
        //             onPress: () => {
        //                 setLoading(true);
        //                 createAccount(
        //                     fullName,
        //                     userEmail,
        //                     userPassword,
        //                     userName,
        //                     setLoading,
        //                     setLoadingMessage
        //                 );
        //             },
        //             style: "cancel",
        //         },
        //     ]
        // );
    };

    return loading ? (
        <View style={masterStyles.mainView}>
            <Image
                style={[masterStyles.logo]}
                source={require("../../../assets/metalliclogo.png")}
            />

            <View
                style={{
                    width: screenSize.width - 20,
                    borderRadius: 4,
                }}
                justifyContent="center"
            >
                <Text
                    style={[
                        masterStyles.headingsSmall,
                        { paddingBottom: screenSize.height * 0.005 },
                        {
                            textAlignVertical: "center",
                            textAlign: "center",
                        },
                    ]}
                >
                    {loadingMessage}
                </Text>
                <Text></Text>
                {/* <CustomButton
                    onPress={() => {
                        setLoading(false);
                    }}
                    text="Go back"
                    color="#1e1c21"
                    width={screenSize.width - 60}
                    height={screenSize.height / 20}
                ></CustomButton> */}
            </View>
        </View>
    ) : (
        <View style={masterStyles.mainView}>
            <Image
                style={[masterStyles.logo]}
                source={require("../../../assets/metalliclogo.png")}
            />

            <KeyboardAwareScrollView style={masterStyles.registrationKeyboardAwareView}>
                <Text></Text>
                <Text style={masterStyles.mainHeadings}>
                    Name
                </Text>

                <TextInput
                    style={[
                        masterStyles.input,
                        {width: Platform.OS == 'web' ? screenSize.width * .58 : screenSize.width * .85},
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

                <Text style={masterStyles.mainHeadings}>
                    E-Mail
                </Text>

                <TextInput
                    style={[
                        masterStyles.input,
                        {width: Platform.OS == 'web' ? screenSize.width * .58 : screenSize.width * .85},
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

                <Text style={masterStyles.mainHeadings} >
                    Username
                </Text>

                <TextInput
                    style={[
                        masterStyles.input,
                        {width: Platform.OS == 'web' ? screenSize.width * .58 : screenSize.width * .85},
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

                <Text style={masterStyles.mainHeadings}>
                    Password
                </Text>

                <TextInput
                    style={[
                        masterStyles.input,
                        {width: Platform.OS == 'web' ? screenSize.width * .58 : screenSize.width * .85},
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

                <Text style={masterStyles.mainHeadings}>
                    Confirm Password
                </Text>

                <TextInput
                    style={[
                        masterStyles.input,
                        {width: Platform.OS == 'web' ? screenSize.width * .58 : screenSize.width * .85},
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
                
                <View style={{height: screenSize.height * .05}}/>

                <CustomButton
                    onPress={onRegisterPress}
                    text="Create Account"
                    color="#117ed1"
                    width={Platform.OS == 'web' ? screenSize.width * .58 : screenSize.width * .85}
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
