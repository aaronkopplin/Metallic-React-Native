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
import * as WalletFunctions from "../../ethereum/walletFunctions";

export function UserAccountScreen({ route }) {
    const screenSize =
        Platform.OS === "web"
            ? Dimensions.get("window")
            : Dimensions.get("screen");
    const { email, fullName, userName, address, score } = route.params;
    const user = firebase.auth().currentUser;
    const [imageUrl, setImageUrl] = useState(undefined);
    const [balance, setBalance] = useState("Loading");
    const [forf, setForF] = useState("Add Contact");
    var found = false;
    useEffect(() => {
        async function populateBalance() {
            var bal = await WalletFunctions.getBalanceFromAddress(address);
            bal = bal / 1000000000000000000;
            console.log(
                "you are viewing: " + address + " with balance: " + bal
            );
            setBalance(bal.toString());
        }

        populateBalance();
    }, []);

    useEffect(() => {
        const userRef = firebase.firestore().collection("users").doc(user.uid);
        const ContactsRef = userRef.collection("Contacts"); 
        ContactsRef.onSnapshot((person) =>
            {
                person.forEach((doc) => {
                    if (doc.data().userName == userName){
                        setForF("Remove Contact");
                    }
                }
                )
            }
        )
        
    }, [forf])

    useEffect(() => {
        // Failed to find Image for user        
        const getImage = async(userName) => {
            if (userName != ""){
                const ref = await firebase.storage().ref('/' + userName + 'ProfileImage');
                await ref.getDownloadURL().then(onResolve, onReject);
            
                async function onReject(error) {
                    //console.log(error.code)
                }
                
                async function onResolve(foundUrl) {
                    setImageUrl(foundUrl);
                }
            }
        }

        getImage(userName);
    
    }, [userName, imageUrl])

    const navigation = useNavigation();

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
                    address: address,
                    score: score
                };

                ContactsRef.doc(userName).set(data);
                setForF("Remove Contact");
                console.log("Contact Added");
                return;
            }
            // If already a contact confirm delete?
            else {
                snapshot.forEach((doc) => {
                    Platform.OS === "web"
                        ? firebase
                              .firestore()
                              .collection("users")
                              .doc(user.uid)
                              .collection("Contacts")
                              .doc(userName)
                              .delete()
                        : Alert.alert(
                              "Remove Contact",
                              "Would you like to remove the contact?",
                              [
                                  {
                                      text: "Cancel",
                                      onPress: () =>
                                          console.log("Cancel removal"),
                                      style: "cancel",
                                  },
                                  {
                                      text: "Confirm",
                                      onPress: () => {
                                        setForF("Add Contact");
                                          console.log("OK preseed");
                                          firebase
                                              .firestore()
                                              .collection("users")
                                              .doc(user.uid)
                                              .collection("Contacts")
                                              .doc(userName)
                                              .delete();
                                      },
                                  },
                              ]
                          );
                });
                setForF("Add Contact");
            }
        }

        getUser(userRef, userName);
    };


    return (
        <View style={masterStyles.mainView}>
            <View style={masterStyles.accountContainer}>
                <Image
                    style={masterStyles.logo}
                    defaultSource={require("../../../assets/Default_Img.png")}
                    source={{ uri: imageUrl }}
                />
                <Text
                    style={masterStyles.accountUserName}
                >
                    {userName}
                </Text>
                
                <Text> 
                    <Text style={masterStyles.accountHeadings}>
                        Name:{" "}
                    </Text>
                    <Text style={masterStyles.accountDetails}>
                        {fullName}
                    </Text>
                </Text>

                <Text>
                    <Text style={masterStyles.accountHeadings}>
                        Email:{" "}
                    </Text>
                    <Text style={masterStyles.accountDetails}>
                        {email}
                    </Text>
                </Text>

                <Text>
                    <Text style={masterStyles.accountHeadings}>
                        Score:{" "}
                    </Text>
                    <Text style={masterStyles.accountDetails}>
                        {score}
                    </Text>
                </Text>

                <Text style={masterStyles.accountHeadings}>
                    Balance: {balance} Eth
                </Text>

                <View style={{height: screenSize.height / 20}}/>

                <CustomButton
                    onPress={getContacts}
                    text={forf}
                    color="#117ed1"
                    width={Platform.OS == "web" ? screenSize.width *.55 : screenSize.width * .95}
                    height={screenSize.height / 20}
                />

                <View style={{height: screenSize.height / 20}}/>

                <CustomButton
                    onPress={() => {
                        navigation.navigate("Payments", {
                            email: email,
                            fullName: fullName,
                            userName: userName,
                            address: address,
                            score: score
                        });
                    }}
                    text="Send/Request Payment"
                    color="#6111d1"
                    width={Platform.OS == "web" ? screenSize.width *.55 : screenSize.width * .95}
                    height={screenSize.height / 20}
                />
            </View>
        </View>
    );
}
