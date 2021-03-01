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
    Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { firebase } from "../../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import CustomButton from "../../../button";
import { SafeAreaView } from "react-native-safe-area-context";
import { masterStyles } from '../../../../Metallic/masterStyles';

export function AccountScreen(props) {
    const [userFullName, setFullName] = useState("");
    const [userEmail, setEmail] = useState("");
    const screenSize = Platform.OS === "web" ? Dimensions.get("window") : Dimensions.get("screen");

    const onLogoutPress = () =>
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => {
        firebase
            .auth()
            .signOut()
            .then(() => {
            }).catch((error) => {
                console.log(error);
            }); } }
      ],
      { cancelable: false }
    );

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
                    paddingLeft: 20,
                    borderRadius: 4,
                }}
            >
            
            <Text style={[masterStyles.title, {paddingBottom: screenSize.height * .005, textAlign: 'center'}]}>My Account</Text>
            
            <Image
                style={[masterStyles.logo]} 
                source={require("../../../assets/icon.png")}
                
            />

            <Text style={[masterStyles.headings, {paddingBottom: screenSize.height * .005, textAlign: 'center'}]}>{userFullName}</Text>
            <Text style={[masterStyles.headingsSmall, {paddingBottom: screenSize.height * .005, textAlign: 'center'}]}>Email: {userEmail}</Text>
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
                        onPress={onLogoutPress}
                        text="Logout"
                        color="#1e1c21"
                        width={screenSize.width - 80}
                        height={screenSize.height / 20}
                    />
                </View>
            </View>

            <View style={
                masterStyles.mainBackground,
                {flex: 0.5}
            }></View>
        </View>
    );
}
