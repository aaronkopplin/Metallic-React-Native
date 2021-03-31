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
    TouchableNativeFeedbackComponent,
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
import { useEffect } from "react/cjs/react.development";

export function UserAccountScreen({route}) {

    const screenSize = Platform.OS === "web" ? Dimensions.get("window") : Dimensions.get("screen");
    const {email, fullName, userName} = route.params;
    const user = firebase.auth().currentUser;
    const [userImage, setImageUrl] = useState(undefined);

    const ref = firebase.storage().ref('/' + userName + 'ProfileImage');
    ref.getDownloadURL()
        .then( (url) => {setImageUrl(url)})

    const getContacts = async () => {
        const userRef = firebase.firestore().collection("users").doc(user.uid);
        const ContactsRef = userRef.collection("Contacts");
        const contacts = await ContactsRef.get();

        async function getUser(dbRef, name) {
            var contacts = dbRef.collection("Contacts");
            const snapshot = await contacts.where("userName", "==", name).get();

            // Already a contact?
            if (snapshot.empty) {
                const data = {
                    email: email,
                    fullName: fullName,
                    userName: userName,
                }
                ContactsRef.doc(userName).set(data);
                console.log("Contact Added");
                return;
            }
            // If already a contact confirm delete?
            else{
                snapshot.forEach((doc) => {
                    Platform.OS === 
                    "web" ? 
                    firebase.firestore()
                    .collection("users").doc(user.uid)
                    .collection("Contacts").doc(userName)
                    .delete()
                    
                    : Alert.alert(
                        "Remove Contact",
                        "Would you like to remove the contact?",
                        [
                            { 
                                text: "Cancel",
                                onPress: () => console.log("Cancel removal"),
                                style: "cancel"
                            },
                            {
                                text: "Confirm", onPress: () => 
                                {
                                    console.log("OK preseed")
                                    firebase.firestore()
                                    .collection("users").doc(user.uid)
                                    .collection("Contacts").doc(userName)
                                    .delete();
                                }
                            }
                        ]
                    )
                });
            }
        }

        getUser(userRef, userName);
    };

    return (
        <View style={masterStyles.mainBackground}>
            <View style={(masterStyles.mainBackground, { flex: 0.5 })}></View>
            <View
                style={{
                    flex: 4,
                    backgroundColor: "#2e2b30",
                    width: screenSize.width - 40,
                    height:
                        Platform.OS === "web"
                            ? screenSize.height / 2.5
                            : screenSize.width - 30,
                    paddingTop: screenSize.height / 50,
                    alignItems: "center",
                    borderRadius: 4,
                }}
            >
                {/* <Text style={[masterStyles.title, {paddingBottom: screenSize.height * .005, textAlign: 'center'}]}>{} Account</Text> */}

                <Image
                    style={[masterStyles.logo, { borderRadius: 50 }]}
                    source={{ uri: userImage}}
                />
                <Text
                    style={[
                        masterStyles.headings,
                        {
                            paddingBottom: screenSize.height * 0.005,
                            textAlign: "center",
                        },
                    ]}
                >
                    {userName}
                </Text>

                <Text>
                    <Text
                        style={[
                            masterStyles.headingsSmall,
                            {
                                paddingBottom: screenSize.height * 0.005,
                                textAlign: "center",
                            },
                        ]}
                    >
                        Name:{" "}
                    </Text>
                    <Text
                        style={[
                            masterStyles.headingsSmallNotBold,
                            {
                                paddingBottom: screenSize.height * 0.005,
                                textAlign: "center",
                            },
                        ]}
                    >
                        {fullName}
                    </Text>
                </Text>

                <Text>
                    <Text
                        style={[
                            masterStyles.headingsSmall,
                            {
                                paddingBottom: screenSize.height * 0.005,
                                textAlign: "center",
                            },
                        ]}
                    >
                        Email:{" "}
                    </Text>
                    <Text
                        style={[
                            masterStyles.headingsSmallNotBold,
                            {
                                paddingBottom: screenSize.height * 0.005,
                                textAlign: "center",
                            },
                        ]}
                    >
                        {email}
                    </Text>
                </Text>

                <Text>
                    <Text
                        style={[
                            masterStyles.headingsSmall,
                            {
                                paddingBottom: screenSize.height * 0.005,
                                textAlign: "center",
                            },
                        ]}
                    >
                        Account Age:{" "}
                    </Text>
                    <Text
                        style={[
                            masterStyles.headingsSmallNotBold,
                            {
                                paddingBottom: screenSize.height * 0.005,
                                textAlign: "center",
                            },
                        ]}
                    >
                        ###
                    </Text>
                </Text>

                <View
                    style={{
                        zIndex: 1,
                        paddingTop: screenSize.height / 20,
                        paddingBottom: screenSize.height / 70,
                    }}
                >
                    <CustomButton
                        onPress={getContacts}
                        text="Add Contact"
                        color="#1e1c21"
                        width={screenSize.width - 80}
                        height={screenSize.height / 20}
                    />

                </View>
                <View
                    style={{
                        zIndex: 1,
                        // paddingTop: screenSize.height / 20,
                        paddingBottom: screenSize.height / 70,
                    }}
                >
                    <CustomButton
                        onPress={() => {
                            navigation.navigate("Payments", {
                                email: email,
                                fullName: fullName,
                                userName: userName,
                                //uid: uid
                            });
                        }}
                        text="Send/Receive Payment"
                        color="#1e1c21"
                        width={screenSize.width - 80}
                        height={screenSize.height / 20}
                    />
                </View>
            </View>

            <View style={(masterStyles.mainBackground, { flex: 0.5 })}></View>
        </View>
    );
}
