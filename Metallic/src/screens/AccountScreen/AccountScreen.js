import React, { useState } from "react";
import {
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions,
    StyleSheet,
    Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import CustomButton from "../../../button";
import { SafeAreaView } from "react-native-safe-area-context";
import { masterStyles } from "../../../masterStyles";

export function AccountScreen(props) {

    const onLogoutPress = () => {
        console.log("Logout Pressed.");
        firebase
            .auth()
            .signOut()
            .then(() => {
                // alert("Logout Successful.");
            }).catch((error) => {
                console.log(error);
            });
    };

    // var database = firebase.database();

    return (
        // <SafeAreaView style={{flex: 1, backgroundColor: masterStyles.mainBackground.backgroundColor}}>
        <View>
            <View style={{top: 20, backgroundColor: '#000'}}>
                <CustomButton onPress={onLogoutPress} text='Logout' height={50}>
                {/* <Text> Logout </Text> */}
                </CustomButton>
            </View>
            {/* <TouchableOpacity
                onPress={onLogoutPress}
                style={{paddingTop: 50}}
            >
                
            </TouchableOpacity> */}
            <Text style={{paddingTop: 40}}> Full Name </Text>
            <Text style={{paddingTop: 20}}> Email </Text>
            
        </View>
        // </SafeAreaView>
    );
}
