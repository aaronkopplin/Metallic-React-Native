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
                        // alert(thisUserEmail);
                        // alert(doc.email);
                        entity.text = doc.data().email;
                        entity.fullName = doc.data().fullName;
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
            <View style={masterStyles.entityContainer}>
                <TouchableOpacity onPress={() => {navigation.navigate('UserAccountScreen', {
                    email: item.email,
                    fullName: item.fullName,
                    // username: item.user

                });
                }}>
                    <Text style={masterStyles.entityText} >
                    {index}. {item.text}
                    
                    </Text>
                </TouchableOpacity>
                
            </View>
        );
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: masterStyles.mainBackground.backgroundColor}}>
            <View style={masterStyles.mainBackground}>
                <View style={{backgroundColor: '#1e1c21', alignItems: 'center', height: screenSize.height * 0.01}} />
                
                <TextInput
                    style={[masterStyles.input,
                        { top: 50, width: screenSize.width - 60}]}
                    placeholder="Enter name/username"
                    placeholderTextColor="#aaaaaa"
                    // onChangeText={[text => setSearchText(text)]}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                {/* <TouchableOpacity onPress={updateFoundUsers()}>
                    <Text>Search</Text>
                </TouchableOpacity> */}
                <CustomButton
                    text="search"
                    color="#1e1c21"
                    width={screenSize.width - 60}
                    height={screenSize.height / 20}
                    // onPress={[alert(searchText)]}
                />
                {/* <View style={masterStyles.listContainer}> */}
                {/* <ScrollView>
                    { users.map( user => {
                        return (
                            <View key={user.key} >
                                <TouchableOpacity>
                                    <Text>{user.email}</Text>
                                </TouchableOpacity>
                                
                            </View>
                        );
                    })}
                </ScrollView> */}
                <View>
                    <FlatList
                        data={users}
                        renderItem={renderUser}
                        keyExtractor={(item) => item.id}
                        removeClippedSubviews={true}
                        
                    />
                </View>
                {/* </View> */}

                <View style={
                    masterStyles.mainBackground,
                    {flex: 1}
                }></View>

            </View>
        </SafeAreaView>
    );
}
