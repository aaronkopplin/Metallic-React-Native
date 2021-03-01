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
import CustomButton from "../../../button";
import { masterStyles } from '../../../../Metallic/masterStyles';

export function login(email, password) {
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
    const screenSize = Platform.OS === "web" ? Dimensions.get("window") : Dimensions.get("screen");
    const onFooterLinkPress = () => {
        console.log("Don't Have Account Pressed");
        navigation.navigate("Registration");
    };

    const onLoginPress = () => {
        console.log("Login Button Pressed.");
        login(email, password);
    };

    return (
        <View style={masterStyles.mainBackground}>
            
            <Image
                style={[masterStyles.logo, {flex: .75}]} 
                source={require("../../../assets/metallic logo.png")}
                
            />

            <View
                style={{
                    flex: 4,
                    backgroundColor: "#2e2b30",
                    width: screenSize.width - 20,
                    height: Platform.OS === "web" ? screenSize.height/2.5 : screenSize.width - 30,
                    paddingTop: screenSize.height / 50,
                    paddingLeft: 20,
                    borderRadius: 4,
                }}
            >

                <Text style={[masterStyles.headingsSmall, {paddingTop: screenSize.height * .01, paddingBottom: screenSize.height * .005}]}>E-Mail</Text>

                <TextInput
                    style={[masterStyles.input,
                        {width: screenSize.width - 60}]}
                    placeholder="Enter your e-mail"
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    keyboardType={'email-address'}
                />

                <Text style={[masterStyles.headingsSmall, {paddingTop: screenSize.height * .01, paddingBottom: screenSize.height * .005}]}>Password</Text>

                <TextInput
                    style={[masterStyles.input,
                        {width: screenSize.width - 60}]}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder="Enter your password"
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

                <View
                    style={{
                        zIndex: 1,
                        paddingTop: screenSize.height / 20,
                        paddingBottom: screenSize.height / 70,
                    }}
                >
                    <CustomButton
                        onPress={onLoginPress}
                        text="Login"
                        color="#1e1c21"
                        width={screenSize.width - 60}
                        height={screenSize.height / 20}
                    />
                </View>

                <View style={{ zIndex: 2 }}>
                    <CustomButton
                        onPress={onFooterLinkPress}
                        text={"Don't have an account?"}
                        color="#1e1c21"
                        width={screenSize.width - 60}
                        height={screenSize.height / 20}
                    />
                </View>
            </View>

            <View style={
                masterStyles.mainBackground,
                {flex: 1}
            }></View>

        </View>
    );
}
