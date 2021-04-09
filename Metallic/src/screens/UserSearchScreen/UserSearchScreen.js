import React, { useEffect, useState } from "react";
import {
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions,
    Platform,
    FlatList,
} from "react-native";
import { firebase } from "../../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { masterStyles } from "../../../masterStyles";

export function UserSearchScreen(props) {


    const screenSize = Platform.OS === "web" ? Dimensions.get("window") : Dimensions.get("screen");

    const [searchText, setSearchText] = useState("");


    var [users, setUsers] = useState([]);
    const thisUser = firebase.auth().currentUser;
    const userRef = firebase.firestore().collection("users");

    useEffect(() => {
        // retrieve users from firebase without returning my own account
        userRef.where("email", "!=", thisUser.email)
            .onSnapshot(
                (querySnapshot) => {
                    var newEntities = [];
                    if (searchText.trim != "") {    // search text entered
                        querySnapshot.forEach(doc => {
                            const entity = doc.data();

                            // get text prior to @ of email
                            var emailToSearch = String(entity.email).substring(0, (String(entity.email).lastIndexOf('@'))).toLowerCase();
                            const search = searchText.toLowerCase();

                            // return only accounts that contain search text in the email, fullName, or userName
                            if (emailToSearch.includes(search) || String(entity.fullName).toLowerCase().includes(search) || String(entity.userName).toLowerCase().includes(search)) {
                                newEntities.push(entity);
                            }

                        });
                    } else {    // no search text entered
                        querySnapshot.forEach(doc => {
                            const entity = doc.data();

                            newEntities.push(entity);
                        });
                    }
                    setUsers(newEntities);

                },
                (error) => {
                    console.log(error);
                }
            );
    });

    const navigation = useNavigation();
    const renderUser = ({ item, index }) => {
        var imageSize = Platform.OS === "web" ? 50 : 35;
        return (
            <View style={[masterStyles.entityContainer]}>
                <TouchableOpacity onPress={() => {
                    
                    if (thisUser.uid == item.id) {
                        navigation.navigate('Account')
                    }
                    else {
                        navigation.navigate('UserAccountScreen', {
                            email: item.email,
                            fullName: item.fullName,
                            userName: item.userName,
                            address: item.address,
                        });
                    }
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image 
                            style={[masterStyles.recentChatsLogo,{borderRadius: 50, resizeMode: "contain" }]}
                            source={require("../../../assets/Default_Img.png")}></Image>
                        <View style={{paddingLeft: 10}}>
                            <Text style={[masterStyles.headingsSmall]} >{item.email}</Text>
                            <Text style={[masterStyles.headingsSmallNotBold]} >{item.userName}</Text>
                        </View>
                    </View>
                </TouchableOpacity>

            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#1e1c21", alignContent: 'center', justifyContent: 'space-evenly', alignItems: 'center' }}>
            <View style={{ backgroundColor: "#2e2b30", alignItems: 'center', paddingBottom: 40, borderRadius: 4, height: screenSize.height * 0.75, width: screenSize.width - 20 }}>
                <View style={{ backgroundColor: '#2e2b30', alignItems: 'center', top: 20, height: screenSize.height * 0.01, paddingBottom: 20 }} />
                <View style={{ width: screenSize.width - 40 }}>
                    <TextInput
                        style={[masterStyles.input]}
                        placeholder="Enter name/username to search for a user"
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(text) => setSearchText(text)}
                        clearButtonMode="while-editing"
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                </View>
                <View style={{ paddingVertical: 20, height: (screenSize.height * 0.75) - 40, width: screenSize.width - 20, paddingHorizontal: 10 }}>
                    <FlatList
                        data={users}
                        renderItem={renderUser}
                        keyExtractor={(item) => item.id}
                        removeClippedSubviews={true}
                    />

                </View>
            </View>
        </SafeAreaView>
    );
}