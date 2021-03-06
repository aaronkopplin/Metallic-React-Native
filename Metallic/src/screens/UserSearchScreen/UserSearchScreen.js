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
    const screenSize =
        Platform.OS === "web"
            ? Dimensions.get("window")
            : Dimensions.get("screen");

    const [searchText, setSearchText] = useState("");

    var [users, setUsers] = useState([]);
    const thisUser = firebase.auth().currentUser;
    const userRef = firebase.firestore().collection("users");

    useEffect(() => {
        // retrieve users from firebase without returning my own account
        userRef.where("email", "!=", thisUser.email).onSnapshot(
            (querySnapshot) => {
                var newEntities = [];
                if (searchText.trim != "") {
                    // search text entered
                    querySnapshot.forEach((doc) => {
                        const entity = doc.data();

                        // get text prior to @ of email
                        var emailToSearch = String(entity.email)
                            .substring(0, String(entity.email).lastIndexOf("@"))
                            .toLowerCase();
                        const search = searchText.toLowerCase();

                        // return only accounts that contain search text in the email, fullName, or userName
                        if (
                            emailToSearch.includes(search) ||
                            String(entity.fullName)
                                .toLowerCase()
                                .includes(search) ||
                            String(entity.userName)
                                .toLowerCase()
                                .includes(search)
                        ) {
                            newEntities.push(entity);
                        }
                    });
                } else {
                    // no search text entered
                    querySnapshot.forEach((doc) => {
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
    }, [searchText]);

    const navigation = useNavigation();
    const renderUser = ({ item, index }) => {
        return (
            <View style={[masterStyles.entityContainer]}>
                <TouchableOpacity onPress={() => {
                    setSearchText("");

                    if (thisUser.uid == item.id) {
                        navigation.navigate('Account')
                    }
                    else {
                        var destination = 'ViewOtherAccount';
                        if (Platform.OS === "web"){
                            destination = 'UserAccountScreen'
                        }
                        navigation.navigate(destination, {
                            email: item.email,
                            fullName: item.fullName,
                            userName: item.userName,
                            address: item.address,
                            score: item.score
                        });
                    }
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image 
                            style={masterStyles.userSearchLogo}
                            defaultSource={require("../../../assets/Default_Img.png")}
                            source={{
                                uri:
                                    "https://storage.googleapis.com/metallic-975be.appspot.com/" +
                                    item.userName +
                                    "ProfileImage",
                            }}
                        />
                        <View style={{ paddingLeft: 10 }}>
                            <Text
                                style={[
                                    masterStyles.headingsSmall,
                                    {
                                        color: "#fff",
                                        fontWeight: "normal",
                                        fontSize: 25,
                                    },
                                ]}
                            >
                                {item.userName}
                            </Text>
                            <Text
                                style={[
                                    masterStyles.headingsSmallNotBold,
                                    {
                                        fontWeight: "normal",
                                        paddingLeft: 15,
                                        fontSize: 15,
                                    },
                                ]}
                            >
                                {item.email}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={masterStyles.mainView}>
            <View style={{  height: Platform.OS == "web" ? (screenSize.height * 0.85) : screenSize.height,
                            maxHeight: Platform.OS == "web" ? screenSize.height: (screenSize.height * 0.75), top: Platform.OS == "android" ? 8 : 0}}>
                <View style={masterStyles.userSearchPrompt}>
                    <TextInput
                        style={[masterStyles.input, {width: Platform.OS == "web" ? screenSize.width *.6 : screenSize.width * .99}]}
                        placeholder="Enter name/username to search for a user"
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(text) => setSearchText(text)}
                        clearButtonMode="while-editing"
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                        clearTextOnFocus={true}
                        value={searchText}
                    />
                <View style={masterStyles.userSearchListContainer}>
                {/* <View style={{ backgroundColor: "#2e2b30", alignItems: 'center', borderRadius: 4, width: screenSize.width - 20, marginTop: 10,  }}>
                    <View style={{ paddingVertical: 10, height: (screenSize.height * 0.75) - 40, width: screenSize.width - 20, paddingHorizontal: 10 }}> */}
                        <FlatList
                            data={users}
                            renderItem={renderUser}
                            keyExtractor={(item) => item.id}
                            removeClippedSubviews={true}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
