import React, { useState } from "react";
import {
    Image,
    Text,
    TextInput,
    View,
    Dimensions,
    Platform,
} from "react-native";
import CustomButton from "../../../button";
import { masterStyles } from "../../../../Metallic/masterStyles";
import "firebase/storage";
import { defaultImage } from "../../../assets/Default_Img.png";
import * as FirebaseFunctions from "../../firebase/firebaseFunctions";
import * as WalletFunctions from "../../ethereum/walletFunctions";

// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";

// Import the ethers library
import { ethers } from "ethers";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function RegistrationScreen({ navigation }) {
    // state
    // const [name, setFullName] = useState("");
    var name = "";
    // const [email, setEmail] = useState("");
    var email = "";
    // const [password, setPassword] = useState("");
    var password = "";
    // const [confirmPassword, setConfirmPassword] = useState("");
    var confirmPassword = "";
    // const [userName, setUserName] = useState("");
    var userName = "";
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

    function onRegisterPress() {
        if (name == "") {
            setLoadingMessage("Please enter a name for the account.");
            return;
        }

        if (email == "") {
            setLoadingMessage("Please enter an email for the account.");
            return;
        }

        if (password == "") {
            setLoadingMessage("Please enter a password.");
            return;
        }

        if (confirmPassword == "") {
            setLoadingMessage("Please confirm password.");
            return;
        }

        if (userName == "") {
            setLoadingMessage("Please enter a username for the account.");
            return;
        }

        if (password !== confirmPassword) {
            setLoadingMessage("Passwords don't match.");
            return;
        }

        createAccountAndLogin();

        async function createAccountAndLogin() {
            var wallet = await WalletFunctions.createRandomWalletAndWriteToStorage(
                userName
            );

            var errorMessage = await FirebaseFunctions.firebaseCreateAccountAndLogIn(
                email,
                password,
                name,
                userName,
                wallet.address
            );

            if (errorMessage != "") {
                setLoadingMessage(errorMessage);
            }
        }
    }

    return loading ? (
        <View style={masterStyles.mainBackground} justifyContent="flex-start">
            <Image
                style={[masterStyles.logo]}
                source={require("../../../assets/metalliclogo.png")}
            />
            <View
                style={{
                    flex: 0.5,
                    backgroundColor: "#2e2b30",
                    width: screenSize.width - 20,
                    paddingLeft: 20,
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
                <CustomButton
                    onPress={() => {
                        setLoading(false);
                    }}
                    text="Go Back"
                    color="#1e1c21"
                    width={screenSize.width - 60}
                    height={screenSize.height / 20}
                />
            </View>
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
                    onChangeText={(text) => (name = text)}
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
                    onChangeText={(text) => (email = text)}
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
                    onChangeText={(text) => (userName = text)}
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
                    onChangeText={(text) => (password = text)}
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
                    onChangeText={(text) => (confirmPassword = text)}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
                />

                <View style={{ marginTop: 30 }}>
                    <CustomButton
                        onPress={() => {
                            setLoadingMessage(
                                "Your account is being created..."
                            );
                            setLoading(true);
                            onRegisterPress();
                        }}
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
            </KeyboardAwareScrollView>

            <View style={(masterStyles.mainBackground, { flex: 0.1 })}></View>
        </View>
    );
}
