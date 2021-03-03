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
    SnapshotViewIOS,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import styles from "./styles";
import { firebase } from "../../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import CustomButton from "../../../button";
import { SafeAreaView } from "react-native-safe-area-context";
import { masterStyles } from "../../../masterStyles";

export function UserAccountScreen({route}) {
    const [userName, setUserName] = useState("");
    const [userFullName, setFullName] = useState("");
    const [userEmail, setEmail] = useState("");
    const {email, fullName} = route.params;

    var db = firebase.firestore();
    async function getUser(datab, userName) {
        var users = datab.collection('users');
        const snapshot = await users.where('id', '==', userID).get();
        
        if (snapshot.empty) {
            alert('no matching');
            return;
        }
        snapshot.forEach(doc => {
            setUserName(doc.data().userName);
            setFullName(doc.data().fullName);
            setEmail(doc.data().email);
            return doc;
        });
    }

    // Placeholder call for Passed in username.
    // getUser(db, props.extraData.stuff);

    return (
        // <SafeAreaView style={{flex: 1, backgroundColor: masterStyles.mainBackground.backgroundColor}}>
        <View>
            <View style={{top: 20, backgroundColor: '#000'}}>
                {/* <CustomButton onPress={} text='Logout' height={50}>
                </CustomButton> */}
            </View>
            
            <Text style={{paddingTop: 20}}> Username: {userName} </Text> 
            <Text style={{paddingTop: 40}}> Full Name: {fullName} </Text>
            <Text style={{paddingTop: 20}}> Email: {email} </Text>
            
        </View>
        // </SafeAreaView>
    );
}
