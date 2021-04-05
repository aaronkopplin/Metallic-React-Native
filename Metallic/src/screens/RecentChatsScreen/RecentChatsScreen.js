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

    // For Chat logs we can't query a specific index only the entire array
    // Can probably be optimized
    // Could Also just filter manipulate the string in the output.
    useEffect(() => {
        chatReference.onSnapshot(
            (querySnapshot) => {
                var newEntities = [];
                var newLogs = [];
                querySnapshot.forEach((doc) => {
                    const entity = doc.id;
                    const log = doc.data().chatLog;
                    newEntities.push(entity);
                    newLogs.push(log[0]);
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

            snapShot.forEach((doc) => {
                address = doc.data().address;
                email = doc.data().email;
                fullName = doc.data().fullName;
            });

            navigation.navigate("Payments", {
                email: email,
                fullName: fullName,
                userName: userName,
                address: address,
            });
        }

        getData();
    };


    const renderChat = ({ item, index }) => {
        return (
            <View style={[masterStyles.entityContainer, {flexDirection: "row"}]}>
                <Image
                    style={[masterStyles.recentChatsLogo, {borderRadius: 45, resizeMode: "contain"}]}
                    source={require("../../../assets/Default_Img.png")}
                />
                <TouchableOpacity
                    onPress={() => {
                        goToPayments(item);
                    }}
                >
                    <Text style={[masterStyles.entityText]}>
                        {item}
                    </Text>
                    <Text style={[masterStyles.recentChat]}>
                        {(contentLogs[index])}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={masterStyles.mainBackground}>
            <View style={(masterStyles.mainBackground, { flex: 0.1 })}></View>
            <Text style={[masterStyles.entityText, {alignSelf: "flex-start", paddingLeft: screenSize.width * .01}]}> Recent Chats </Text>
            <View
                style={{
                    flex: 3,
                    backgroundColor: "#2e2b30",
                    width: screenSize.width - 40,
                    height:
                        Platform.OS === "web"
                            ? screenSize.height / 2.5
                            : screenSize.width - 30,
                    paddingTop: screenSize.height / 50,
                    paddingLeft: 20,
                    borderRadius: 4,
                }}
            >
                <FlatList
                    data={chats}
                    renderItem={renderChat}
                    keyExtractor={(item) => item}
                    removeClippedSubviews={true}
                />
            </View>
            <View style={(masterStyles.mainBackground, { flex: 0.1 })}></View>
        </View>
    );
}
