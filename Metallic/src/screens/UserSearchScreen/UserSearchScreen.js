import React, { useEffect, useState } from "react";
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
    FlatList,
    ScrollView,
    Alert
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

export function UserSearchScreen(props) {

    
    const screenSize = Platform.OS === "web" ? Dimensions.get("window") : Dimensions.get("screen");

    const [searchText, setSearchText] = useState("");
    

    const [users, setUsers] = useState([]);
    const [thisUserEmail, setThisUserEmail] = useState("");
    const [thisUserName, setThisUserName] = useState("");
    const [thisUserID, setThisUserID] = useState("");
    const userRef = firebase.firestore().collection("users");

    // async function updateFoundUsers() {
    //     // setSearchText();
    //     var users = firebase.firestore().collection('users');
    //     const snapshot = await users.get();
    //     setUsers();
    //     const newEntities = [];

    //     if (snapshot.empty) {
    //         alert('no matching');
    //         return;
    //     }
    //     // alert(searchText);
    //     snapshot.forEach(doc => {
    //         setThisUserEmail(doc.data().email);
    //         setThisUserName(doc.data().fullName);
    //         setThisUserID(doc.data().id);

    //         const entity = doc.data();
    //         entity.id = doc.id;
    //         entity.text = thisUserEmail;
    //         entity.fullName = doc.data().fullName;
    //         entity.email = doc.data().email;
    //         // newEntities.push(entity);
    //         if (searchText.length > 0) {
    //             if (thisUserEmail.includes(searchText)) {
    //                 // alert("True");
    //                 alert(entity.email);
    //                 newEntities.push(entity);
    //             }
    //         }
    //         return doc;
            
    //     });
    //     setUsers(newEntities);
    //         // setFullName(doc.data().fullName);
    //         // setEmail(doc.data().email);
    //         // return doc;
    // }
    
    useEffect(() => {
        userRef
            // .orderBy("createdAt", "desc")
            .onSnapshot(
                (querySnapshot) => {
                    const newEntities = [];
                    querySnapshot.forEach(doc => {
                        const entity = doc.data();
                        // setThisUserID(entity.id);
                        // setThisUserEmail(entity.email);
                        entity.id = doc.id;
                        entity.text = doc.data().email;
                        entity.fullName = doc.data().fullName;
                        entity.userName = doc.data().userName;
                        setThisUserID(entity.id);
                        setThisUserEmail(entity.email);
                        
                        newEntities.push(entity);
                        // if (searchText.trim() != "") {
                        //     alert(thisUserEmail);
                        //     if (thisUserEmail.includes(searchText)) {
                        //         alert(thisUserEmail);
                        //         console.error("true");
                        //         console.log('true');
                        //         newEntities.push(entity);
                                 
                        //     }
                        // }
                        
                        
                    });
                    setUsers(newEntities);
                },
                (error) => {
                    console.log(error);
                }
            );
    }, []);

    // getListViewItem = (user) => {
    //     Alert.alert(user.key);
    // }
    const navigation = useNavigation();
    const renderUser = ({ item, index }) => {
        return (
            <View style={[masterStyles.entityContainer, {paddingBottom: 20}]}>
                <TouchableOpacity onPress={() => {navigation.navigate('UserAccountScreen', {
                    email: item.email,
                    fullName: item.fullName,
                    userName: item.userName,

                });
                }}>
                    <Text style={masterStyles.headingsSmallNotBold} >
                    {item.text}
                    
                    </Text>
                </TouchableOpacity>
                
            </View>
        );
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#1e1c21", alignContent: 'center', justifyContent: 'space-evenly'}}>
            <View style={{backgroundColor: "#2e2b30", alignItems: 'center', justifyContent: 'space-evenly', borderRadius: 4, width: screenSize.width - 20, left: 10}}>
                <View style={{backgroundColor: '#2e2b30', alignItems: 'center', height: screenSize.height * 0.01, paddingBottom: 20}} />
                <View style={{width: screenSize.width - 60}}>
                    <TextInput
                        style={[masterStyles.input]}
                        placeholder="Enter name/username to search for a user"
                        placeholderTextColor="#aaaaaa"
                        // onChangeText={[text => setSearchText(text)]}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                </View>
                {/* <View style={{paddingTop: 15}}>
                    <CustomButton
                        text="search"
                        color="#1e1c21"
                        width={screenSize.width - 60}
                        height={screenSize.height / 20}
                        paddingTop={20}
                        // onPress={[alert(searchText)]}
                    />
                </View> */}
                <View style={{paddingTop: 20, paddingBottom: 20, width: screenSize.width - 60}}>
                    <FlatList
                        data={users}
                        renderItem={renderUser}
                        keyExtractor={(item) => item.id}
                        removeClippedSubviews={true}
                    />
                    
                </View>

                <View style={
                    masterStyles.mainBackground,
                    {flex: 1}
                }/>

            </View>
        </SafeAreaView>
    );
}
