import React, { useState } from "react";
import {
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions,
    StyleSheet,
    FlatList,
    Platform,
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
    // Create user reference
    if (user != null){
    const userRef = firebase.firestore().collection("users").doc(user.uid);

    const ContactsRef = userRef.collection("Contacts");

    const [contactsList, setContactsList] = useState([]); 

    useEffect(() => {
        ContactsRef.onSnapshot((querySnapshot) => {
            var list = [];
            querySnapshot.forEach(doc => {
                const entity = doc.data();
                
                list.push(entity);
            });
            setContactsList(list);
        })
    }, []);

    const renderUser = ({ item, index }) => {
        return (
            <View style={[masterStyles.entityContainer, {paddingBottom: 20}]}>
                <TouchableOpacity onPress={() => {navigation.navigate('UserAccountScreen', {
                    email: item.email,
                    fullName: item.fullName,
                    userName: item.userName,

                });
                }}>
                    <View>
                        <Text>
                        <View style={{justifyContent: "center", flex: 1}}>
                            <Image style={{height: 35, width: 20}} source={require("../../../assets/Default_Img.png")}></Image>
                        </View> 
                        <View style={{justifyContent: "center", flex: 1}}>
                            <Text style={[masterStyles.headingsSmall]} >{'\t'}{item.email}</Text>
                            <Text style={[masterStyles.headingsSmallNotBold]} >{'\t'}{item.userName}</Text>
                        </View>
                        </Text>
                    </View>
                </TouchableOpacity>
                
            </View>
        );
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#1e1c21", alignContent: 'center', justifyContent: 'space-evenly', alignItems: 'center'}}>
            <View style={{backgroundColor: "#2e2b30", alignItems: 'center', paddingBottom: 40, borderRadius: 4, height: screenSize.height * 0.75, width: screenSize.width - 20}}>
                <View style={{paddingVertical: 20, height: (screenSize.height * 0.75) - 40, width: screenSize.width - 20, paddingHorizontal: 10}}>
                    <FlatList
                        data={contactsList}
                        renderItem={renderUser}
                        keyExtractor={(item) => item.uid}
                        removeClippedSubviews={true}
                    />
                    
                </View>
            </View>
        </SafeAreaView>
    );
}
}