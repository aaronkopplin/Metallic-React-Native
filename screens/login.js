import React, { Component } from "react";
import {
    StyleSheet,
    Button,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
    Image,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

function login(navigation) {
    navigation.navigate("Home");
}

function LoginScreen({ navigation }) {
    return (
        <View behavior="padding" style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    style={styles.logo}
                    source={require("../assets/favicon.png")}
                />
                <Text style={styles.title}>Login screen : )</Text>
            </View>
            <View>
                <StatusBar barStyle="light-content" />
                <TextInput
                    placeholder="username or email"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    returnKeyType="next"
                    onSubmitEditing={() => passwordInput.focus()}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                />
                <TextInput
                    placeholder="password"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    returnKeyType="go"
                    secureTextEntry
                    style={styles.input}
                    ref={(input) => (passwordInput = input)}
                />

                <TouchableOpacity
                    onPress={() => navigation.navigate("RegisterScreen")}
                    style={styles.loginButton}
                >
                    <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.createAccountButton}>
                    <Text style={styles.buttonText}>
                        Tap here to create an account
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: "dodgerblue",
    },
    input: {
        height: 40,
        backgroundColor: "rgba(255,255,255,0.2)",
        marginBottom: 10,
        color: "white",
        paddingHorizontal: 10,
    },
    loginButton: {
        backgroundColor: "blue",
        paddingVertical: 15,
        marginBottom: 10,
    },
    buttonText: {
        textAlign: "center",
        color: "white",
        fontWeight: "700",
    },
    logoContainer: {
        alignItems: "center",
        flexGrow: 1,
        justifyContent: "center",
    },
    logo: {
        width: 100,
        height: 100,
    },
    title: {
        color: "white",
        marginTop: 10,
        width: 160,
        textAlign: "center",
        opacity: 0.9,
    },
    createAccountButton: {
        paddingVertical: 15,
        marginBottom: 10,
    },
    buttonText: {
        textAlign: "center",
        color: "white",
        fontWeight: "700",
    },
});

export default LoginScreen;
