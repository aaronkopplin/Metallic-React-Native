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
import * as FirebaseFunctions from "../../firebase/firebaseFunctions";
import CustomButton from "../../../button";
import { masterStyles } from "../../../../Metallic/masterStyles";

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
                    height:
                        Platform.OS === "web"
                            ? screenSize.height / 2.5
                            : screenSize.width - 30,
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
                <View style={{ marginTop: 30, marginBottom: 20 }}>
                    <CustomButton
                        onPress={() => {
                            FirebaseFunctions.firebaseLogin(email, password);
                        }}
                        text="Login"
                        color="#1e1c21"
                        width={screenSize.width - 60}
                        height={screenSize.height / 20}
                    />
                </View>
                <View>
                    <CustomButton
                        onPress={onFooterLinkPress}
                        text={"Don't have an account?"}
                        color="#1e1c21"
                        width={screenSize.width - 60}
                        height={screenSize.height / 20}
                    />
                </View>
                <Text></Text>
            </KeyboardAvoidingView>
        </View>
    );
}
