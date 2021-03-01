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

export function AccountScreen(props) {
    const [userFullName, setFullName] = useState("");
    const [userEmail, setEmail] = useState("");
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
    var uid;    
    if (user != null) {
        uid = user.uid;
        async function getUser(datab, userID) {
            var users = datab.collection('users');
            const snapshot = await users.where('id', '==', userID).get();
        
            if (snapshot.empty) {
                alert('no matching');
                return;
            }
            snapshot.forEach(doc => {
                setFullName(doc.data().fullName);
                setEmail(doc.data().email);
                return doc;
            });
        }
        getUser(db,uid);
    }

    return (
        // <SafeAreaView style={{flex: 1, backgroundColor: masterStyles.mainBackground.backgroundColor}}>
        <View>
            <View style={{top: 20, backgroundColor: '#000'}}>
                <CustomButton onPress={onLogoutPress} text='Logout' height={50}>
                </CustomButton>
            </View>
            <Text style={{paddingTop: 40}}> {userFullName} </Text>
            <Text style={{paddingTop: 20}}> {userEmail} </Text>
            
        </View>
        // </SafeAreaView>
    );
}
