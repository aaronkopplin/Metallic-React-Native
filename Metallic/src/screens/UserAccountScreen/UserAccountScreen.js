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
    // const [userName, setUserName] = useState("");
    // const [userFullName, setFullName] = useState("");
    // const [userEmail, setEmail] = useState("");
    const screenSize = Platform.OS === "web" ? Dimensions.get("window") : Dimensions.get("screen");
    const {email, fullName, userName} = route.params;
    const user = firebase.auth().currentUser;
    // var db = firebase.firestore();
    // async function getUser(datab, userName) {
    //     var users = datab.collection('users');
    //     const snapshot = await users.where('id', '==', userID).get();
        
    //     if (snapshot.empty) {
    //         alert('no matching');
    //         return;
    //     }
    //     snapshot.forEach(doc => {
    //         setUserName(doc.data().userName);
    //         setFullName(doc.data().fullName);
    //         setEmail(doc.data().email);
    //         return doc;
    //     });
    // }

    // Placeholder call for Passed in username.
    // getUser(db, props.extraData.stuff);

    const addContact = () => {
        const userRef = firebase.firestore().collection("users").doc(user.uid);
        const ContactsRef = userRef.collection("Contacts");

        const data = {
            email,
            fullName,
            userName
        }

        ContactsRef.add(data);
    };

    return (
        <View style={masterStyles.mainBackground}>
            <View style={
                masterStyles.mainBackground,
                {flex: 0.5}
            }></View>
            <View
                style={{
                    flex: 4,
                    backgroundColor: "#2e2b30",
                    width: screenSize.width - 40,
                    height: Platform.OS === "web" ? screenSize.height/2.5 : screenSize.width - 30,
                    paddingTop: screenSize.height / 50,
                    alignItems: "center",
                    borderRadius: 4,
                }}
            >
            
            {/* <Text style={[masterStyles.title, {paddingBottom: screenSize.height * .005, textAlign: 'center'}]}>{} Account</Text> */}
            
            <Image
                style={[masterStyles.logo, {borderRadius: 50}]} 
                source={require("../../../assets/Default_Img.png")}
            />

            <Text style={[masterStyles.headings, {paddingBottom: screenSize.height * .005, textAlign: 'center'}]}>{userName}</Text>
            <Text style={[masterStyles.headingsSmall, {paddingBottom: screenSize.height * .005, textAlign: 'center'}]}>Name: {fullName}</Text>
            <Text style={[masterStyles.headingsSmall, {paddingBottom: screenSize.height * .005, textAlign: 'center'}]}>Email: {email}</Text>
            <Text style={[masterStyles.headingsSmall, {paddingBottom: screenSize.height * .005, textAlign: 'center'}]}>Balance:</Text>
            <Text style={[masterStyles.headingsSmall, {paddingBottom: screenSize.height * .005, textAlign: 'center'}]}>Account Age:</Text>
            <View
                    style={{
                        zIndex: 1,
                        paddingTop: screenSize.height / 20,
                        paddingBottom: screenSize.height / 70,
                    }}
                >

                    <CustomButton
                        onPress={addContact}
                        text="Add Contact"
                        color="#1e1c21"
                        width={screenSize.width - 80}
                        height={screenSize.height / 20}
                    />
                    {/* <CustomButton
                        onPress={() => {
                            navigation.navigate("ContactSearch");
                        }}
                        text="To Contact Search"
                        color="#1e1c21"
                        width={screenSize.width - 80}
                        height={screenSize.height / 20}
                    /> */}
                </View>
            </View>

            <View style={
                masterStyles.mainBackground,
                {flex: 0.5}
            }></View>
        </View>
    );
}
