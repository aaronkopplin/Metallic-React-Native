import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View, Dimensions, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import CustomButton from '../../../button';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const screenSize = Dimensions.get("screen");
    const onFooterLinkPress = () => {
        console.log("Don't Have Account Pressed");
        navigation.navigate("Registration");
    };

    const onLoginPress = () => {
        console.log("Login Button Pressed.");
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
                        navigation.navigate("Home", { user: user });
                    })
                    .catch((error) => {
                        alert(error);
                    });
            })
            .catch((error) => {
                alert(error);
            });
    };

    return (
        <View style={styles.mainBackground}>
             <View style={{ backgroundColor: '#2e2b30', width: '100%', height: '90%', paddingTop: screenSize.height / 50, paddingLeft: 20, borderRadius: 4 }}>
                <Image
                    style={styles.logo}
                    source={require("../../../assets/icon.png")}
                />
                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <View style={styles.filler}></View>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder="Password"
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"q
                />
                <View style={{zIndex: 1, paddingTop: screenSize.height / 20, paddingBottom: screenSize.height / 70}}>
                  <CustomButton onPress={onLoginPress} 
                  text='Login' 
                  color='#1e1c21'
                  
                  width={screenSize.width / 1.1}
                  height={screenSize.height / 20} 
                    />
                </View>

                <View style={{zIndex: 2}}>
                    <CustomButton onPress={onFooterLinkPress} 
                    text={'Don\'t have an account'} 
                    color='#1e1c21' 
                    width={screenSize.width / 1.1}
                    height={screenSize.height / 20} 
                    />
                </View>
            </View>
        </View>
    );
}
