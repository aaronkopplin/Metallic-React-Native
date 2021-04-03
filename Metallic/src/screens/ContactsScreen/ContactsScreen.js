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
    if (user == null){
        return;
    }
    const RefUser = firebase.firestore().collection("users").doc(user.uid);

    const ContactsRef = RefUser.collection("Contacts");

    const [userImage, setImageUrl] = useState(undefined);
    const [contactsList, setContactsList] = useState([]); 
    const [you, setYou] = useState();
    const titles = ["&","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

    // Get the list of contacts
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

        // Get the username for the current user
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

    // TODO: Once image storage is setup for users actually search for it.
    const getImage = (userName) => {
        var ref = firebase.storage().ref('/DefaultImage.png');
        ref.getDownloadURL()
        .then( (url) => {setImageUrl(url)})

        return userImage;
    }

    // Set up navigation and touchable components for each contact.
    const Item = ({ title }) => (
        
        <View
            style={{
                flexDirection: 'row', alignItems: 'center', paddingTop: Platform.OS == "web" ? 5 : 0, paddingLeft: Platform.OS == 'web' ? screenSize.width * 0.008 : screenSize.width * .022
            }}
        >
            <View style={[ masterStyles.contactsLogo, {height: Platform.OS == "web" ? 50 : 40, width: Platform.OS == "web" ? 50 : 40, borderRadius: 50, backgroundColor: "#000"}]}>
                <Image
                    style={[{flex: 1, width: undefined, height: undefined, borderRadius: 50}]}
                    source={{ uri: getImage(title)}}
                />
            </View>
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
                                userName: c.userName,
                                address: c.address,
                            })
                        }})}}>
                    <Text style={masterStyles.contactNames}>{title}</Text>
                </TouchableOpacity>
            </View>
        </View>
        );

    // Go through our list of contacts and add them to the map.
    const populateData = () => {
        contactsList.forEach((contact) => {
            var i = 0;
            titles.forEach((letter) => {
                // Check First letter of our contacts userName.
                if (contact.userName.substring(0,1).toUpperCase() == letter){
                    // If we share this letter add them to this part of our data
                    firstLetterList[i].data.push(contact.userName);
                }
                i++;
            })
        });
        
    };

    // Map out letter to the title of our list.
    const firstLetterList = titles.map((item) => ({
        title: item,
        data: []
    }));

    populateData();

    // Filter out any letter that do not have a contact
    var contactData = firstLetterList.filter(eixisting => eixisting.data.length != 0);

    return (
        <SafeAreaView style={{
            flex: 1, backgroundColor: "#1e1c21", 
            alignContent: 'center', 
            alignItems: 'center',}}>

            <View style={{    
                backgroundColor: "#1e1c21", 
                height: Platform.OS == "web" ? screenSize.height * 0.01 : 0, 
                width: screenSize.width
                }}/>
            <View style={{flexDirection: 'row', alignItems: 'center', bottom: Platform.OS == "web" ? 0 : 10}}>
                <View style={[ masterStyles.contactsUserLogo, {height: 50, width: 50, borderRadius: 50, backgroundColor: "#000"}]}>
                    <Image
                        style={[{flex: 1, width: undefined, height: undefined, borderRadius: 50}]}
                        source={{ uri: getImage(you)}}
                    />
                </View>
                <View style={{
                    backgroundColor: "#ffffff", 
                    borderRadius: 5, 
                    maxWidth: screenSize.width * .75,
                    maxHeight: screenSize.height * .07,
                    overflow: "hidden",
                    textAlign: "center",
                    // bottom: 
                    //     Platform.OS == "web" 
                    //     ? 0
                    //     : screenSize.height * .01,
                    }}>
                    <TouchableOpacity onPress={() => {
                            navigation.navigate('Account')
                        }}>
                        <Text
                            style={[
                                masterStyles.title,
                                {
                                    paddingHorizontal: 10,
                                    color: "#000000",
                                    alignItems: 'flex-end'
                                },
                            ]}
                        > {you} </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{
                
                backgroundColor: "#1e1c21", 
                height: Platform.OS == "web" ? screenSize.height * 0.01 : 0, 
                width: screenSize.width
                }}/>

            <View style={{
                backgroundColor: "#2e2b30", 
                paddingBottom: 10, 
                borderRadius: 4, 
                height: Platform.OS == "web" 
                ? (screenSize.height * 0.75)
                : screenSize.height
                ,
                maxHeight: Platform.OS == "web" 
                ? screenSize.height
                : (screenSize.height * 0.65), 
                width: screenSize.width - 20}}>
                <SectionList
                    sections={contactData}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <Item title={item} />}
                    renderSectionHeader={({ section: { title } }) => (
                    <Text style={masterStyles.contactTitle}>{title}</Text>
                )}
                />
            </View>

        </SafeAreaView>
    );
}