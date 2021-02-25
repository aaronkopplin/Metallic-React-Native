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
import styles from "./styles";
import { firebase } from "../../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import CustomButton from "../../../button";
import { SafeAreaView } from "react-native-safe-area-context";
import { masterStyles } from "../../../masterStyles";

// var fullName;

async function getUser(datab, userID) {
    var users = datab.collection('users');
    const snapshot = await users.where('id', '==', userID).get();

    if (snapshot.empty) {
        alert('no matching');
        return;
    }
    snapshot.forEach(doc => {
        alert(doc.id, '=>', doc.data());
        // alert(doc.data().fullName)
        return doc.data().fullName;
    });
    // return snapshot.doc.data().fullName;
}

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
    var user = firebase.auth().currentUser;
    var db = firebase.firestore();
    
    var fullName, email, uid;
    var info;

    

    if (user != null) {
        // fullName = user.displayName
        email = user.email;
        uid = user.uid;
        // fullName = () => {
        //     firebase.auth().then(() => {
        //         getUser(db, uid);
        //     }).catch((error) => {
        //         console.log(error);
        //     });
        // }
        // getUser(db, uid).then(toString());
        // getUser(db, uid).then(( => {
        //     fullName
        // }))
        alert(getUser(db, uid).then(toString()));
        
    }

    return (
        // <SafeAreaView style={{flex: 1, backgroundColor: masterStyles.mainBackground.backgroundColor}}>
        <View>
            <View style={{top: 20, backgroundColor: '#000'}}>
                <CustomButton onPress={onLogoutPress} text='Logout' height={50}>
                </CustomButton>
            </View>
            <Text style={{paddingTop: 40}}> {fullName} </Text>
            <Text style={{paddingTop: 20}}> {email} </Text>
            
        </View>
        // </SafeAreaView>
    );
}
