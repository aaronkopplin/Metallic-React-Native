import React, { useState } from "react";
import {
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions,
    StyleSheet,
    SectionList,
    Platform,
    StatusBar,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import styles from "./styles";
import { firebase } from "../../firebase/config";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../../button";
import { masterStyles } from '../../../../Metallic/masterStyles';
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";


export function ContactsScreen({ navigation }) {

    const screenSize = Platform.OS === "web" ? Dimensions.get("window") : Dimensions.get("screen");

    const user = firebase.auth().currentUser

    // Is there a user currently?
    if (user != null){
        const RefUser = firebase.firestore().collection("users").doc(user.uid);

        const ContactsRef = RefUser.collection("Contacts");

        const [contactsList, setContactsList] = useState([]); 
        const [you, setYou] = useState();
        const titles = ["&","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

        // Get the lsit of contacts
        useEffect(() => {
            ContactsRef.onSnapshot((querySnapshot) => {
                // Variable for holding each contacts data
                var list = [];
                querySnapshot.forEach(doc => {
                    const entity = doc.data();
                    
                    list.push(entity);
                });
                setContactsList(list);
             //   console.log(contactsList);
            });

            async function getUser() {
                const uid = user.uid;
                const db = firebase.firestore().collection("users");
                const snapshot = await db.where("id", "==", uid).get();
                if (snapshot.empty) {
                    alert("no matching");
                }
                else {snapshot.forEach((doc) => {
                    setYou(doc.data().userName);
                    });
                }
            }
            getUser();

        }, []);

        const Item = ({ title }) => (
            <View style={masterStyles.contactBar}>
                <TouchableOpacity onPress={() => {
                    contactsList.forEach((c) => {
                        if (you == title){
                            navigation.navigate('Account')
                        }
                        else if (c.userName == title){
                            navigation.navigate('UserAccountScreen',{
                                email: c.email,
                                fullName: c.fullName,
                                userName: c.userName
                            })
                        }})}}>
                    <Text style={masterStyles.headings}>{title}</Text>
                </TouchableOpacity>
            </View>
          );

        const populateData = () => {
            contactsList.forEach((contact) => {
                var i = 0;
                titles.forEach((letter) => {
                    // Check First letter of our contacts userName.
                    if (contact.userName.substring(0,1).toUpperCase() == letter){
                        // If we share this letter add them to this part of our data
                        contactData[i].data.push(contact.userName);
                    }
                    i++;
                })
            });
        };

        // Map out letter to the title of our list.
        const contactData = titles.map((item) => ({
            title: item,
            data: []
        }));

        populateData();

        return (
            <SafeAreaView style={{flex: 1, backgroundColor: "#1e1c21", alignContent: 'center', justifyContent: 'space-evenly', alignItems: 'center'}}>
                <View style={{backgroundColor: "#2e2b30", paddingBottom: 40, borderRadius: 4, height: screenSize.height * 0.75, width: screenSize.width - 20}}>
                    <SectionList
                    sections={contactData}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <Item title={item} />}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={masterStyles.title}>{title}</Text>
                    )}
                    />
                </View>
            
            </SafeAreaView>
        );
    }
}