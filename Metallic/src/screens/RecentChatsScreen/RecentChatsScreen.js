import React, { useState, useEffect } from "react";
import {
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions,
    StyleSheet,
    Platform,
    FlatList,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { firebase } from "../../firebase/config";
import CustomButton from "../../../button";
import { masterStyles } from "../../../../Metallic/masterStyles";
import { UserSearchScreen } from "../UserSearchScreen/UserSearchScreen";
import { Message } from "react-native-gifted-chat";

export function RecentChatsScreen({ navigation }) {
    const screenSize =
        Platform.OS === "web"
            ? Dimensions.get("window")
            : Dimensions.get("screen");

    var [chats, setChats] = useState([]);
    var [contentLogs, setContentLogs] = useState([]);
    const user = firebase.auth().currentUser;
    var chatReference = null;
    if (user != null) {
        chatReference = firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .collection("chats");
    }

    useEffect(() => {
        chatReference.onSnapshot(
            (querySnapshot) => {
                var newEntities = [];
                var newLogs = [];
                querySnapshot.forEach((doc) => {
                    const entity = doc.id;
                    const log = doc.data().chatLog;
                    newEntities.push(entity);
                    // if ( !(log[0] == undefined) && Platform.OS != "web" && (log[0].length > 35)) {         
                    //         newLogs.push(log[0].substring(0,35) + "...")
                    // } 
                    // else if (!(log[0] == undefined) && Platform.OS == "web" && (log[0].length > 100)) {
                    //         newLogs.push(log[0].substring(0,100) + "...");
                    // } 
                    // else {
                    newLogs.push(String(log[0]).substring(9, String(log[0]).length - 1));
                            
                    // }
                });
                setChats(newEntities);
                setContentLogs(newLogs);
            },
            (error) => {
                console.log(error);
            }
        );
    }, []);

    const goToPayments = (userName) => {
        async function getData() {
            const snapShot = await firebase
                .firestore()
                .collection("users")
                .where("userName", "==", userName)
                .get();

            var address;
            var email;
            var fullName;
            var score;

            snapShot.forEach((doc) => {
                address = doc.data().address;
                email = doc.data().email;
                fullName = doc.data().fullName;
                score = doc.data().score
            });

            navigation.navigate("Payments", {
                email: email,
                fullName: fullName,
                userName: userName,
                address: address,
                score: score
            });
        }

        getData();
    };

    const renderChat = ({ item, index }) => {
        return (

            <TouchableOpacity
                onPress={() => {
                    goToPayments(item);
                }}
            >
                <View style={[masterStyles.entityContainer, {flexDirection: "row", alignItems: 'center'}]}>
                    <Image
                        style={[masterStyles.recentChatsLogo, {borderRadius: 50, resizeMode: "contain"}]}
                        defaultSource={require("../../../assets/Default_Img.png")}
                        source={{uri: ("https://storage.googleapis.com/metallic-975be.appspot.com/" + item + "ProfileImage")}}
                    />

                    <View>
                        <Text style={[masterStyles.entityText]}>
                            {item}
                        </Text>
                        <Text style={[masterStyles.recentChat, {maxWidth: Platform.OS == "web" ? screenSize.width * .85 : screenSize.width * .75, }]} numberOfLines={2}>
                            {(contentLogs[index])}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[masterStyles.mainBackground]}>
            <Text style={[masterStyles.entityText, {alignSelf: "flex-start", paddingTop: 10, paddingLeft: screenSize.width * .01}]}> Recent Chats </Text>
            <View
                style={{
                    flex: 3,
                    backgroundColor: "#2e2b30",
                    width: screenSize.width - 20,
                    // height:
                    //     Platform.OS === "web"
                    //         ? screenSize.height / 2.5
                    //         : screenSize.width - 30,
                    // paddingTop: screenSize.height / 50,
                    paddingHorizontal: 10,
                    borderRadius: 4,
                    marginBottom: 20,
                    top: 5
                }}
            >
                <FlatList
                    data={chats}
                    renderItem={renderChat}
                    keyExtractor={(item) => item}
                    removeClippedSubviews={true}
                />
            </View>
        </View>
    );
}
