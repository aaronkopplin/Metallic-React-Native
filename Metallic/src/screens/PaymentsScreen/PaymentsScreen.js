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
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    FlatList,
    Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { firebase } from "../../firebase/config";
import CustomButton from "../../../button";
import { masterStyles } from "../../../../Metallic/masterStyles";
import { useNavigation } from "@react-navigation/native";
import * as WalletFunctions from "../../ethereum/walletFunctions";
import {AutoScrollFlatList} from "react-native-autoscroll-flatlist";

export function PaymentsScreen({ route }) {
    const screenSize = Platform.OS === "web" ? Dimensions.get("window") : Dimensions.get("screen");
    const [amountInput, changeAmountInput] = useState(0.0);
    const [available, changeAvailable] = useState(0.0);
    const { email, fullName, userName, address } = route.params;

    const userImageSize = Platform.OS === "web" ? 75 : 50;
    var sendingMessage = "";
    const [memo, setMemo] = useState("");

    // memoTI and amountTI used to clear TextInput on pushing send/request button
    const [memoTI, setMemoTI] = useState("");
    const [amountTI, setAmountTI] = useState("");

    const navigation = useNavigation();

    const [chatLog, updateChatLog] = useState([]);
    const [otherChatLog, updateOtherChatLog] = useState([]);
    const [chatExists, setChatExists] = useState(Boolean);

    const user = firebase.auth().currentUser;
    const [myUserName, setMyUserName] = useState("");
    const [otherUserUID, setOtherUserUID] = useState("");
    const [otherChatRef, setOtherChatRef] = useState();
    const db = firebase.firestore();
    const chatRef = db.collection("users").doc(user.uid).collection("chats").doc(String(userName));
    const otherRef = db.collection("users").where("userName", "==", userName).get();
    var otherChat;
    var exists = false;
    useEffect(() => {
        const fetchBal = async () => {
            const wallet = await WalletFunctions.loadWalletFromPrivate();
            const balance = await (
                await WalletFunctions.getBalance(wallet)
            ).toString();
            changeAvailable(parseFloat(balance));
        };

        fetchBal();

        db.collection("users").doc(user.uid).onSnapshot((snap) => {
            setMyUserName(snap.data().userName);
        })

        

        const otherID = async () => {
            (await otherRef).forEach((doc) => {
                setOtherUserUID(doc.data().id);
                // updateOtherChatLog(otherChat);
                return;
            })
            
            return;
        }
        otherID();

        // const otherUserChat = async () => {
            
        //     if (otherUserUID != "") {
        //         const newOtherRef = db.collection("users").doc(otherUserUID).collection("chats").doc(String(myUserName));
        //         alert(newOtherRef);
        //         newOtherRef.onSnapshot((snapshot) => {
        //             alert("in it");
        //             updateOtherChatLog(snapshot.data().chatLog);
        //         })
        //         // updateOtherChatLog(db.collection("users").doc(otherUserUID).collection("chats").doc(String(myUserName)).get())
        //     }
        //     return;
        // }
        // otherUserChat();
    }, []);

    useEffect(() => {
        // alert(otherUserUID);
        // alert(myUserName);
        
        if (otherUserUID != "" && myUserName != "") {
            otherChat = db.collection("users").doc(otherUserUID).collection("chats").doc(String(myUserName));
            const oc = db.collection("users").doc(otherUserUID).collection("chats");
            oc.doc(myUserName).onSnapshot((snap) => {

                if (snap.exists) {
                    setOtherChatRef(snap.ref);
                    updateOtherChatLog(snap.data().chatLog);
                    setChatExists(true);
                } else {
                    oc.doc(myUserName).set({chatLog: []});
                    setOtherChatRef(snap.ref);
                }

            })

            chatRef.onSnapshot((snapshot) => {
                if (snapshot.exists) {
                    updateChatLog(snapshot.data().chatLog);
                    exists = true;
                    setChatExists(true);
                    return;
                }
            })
        }
    }, [otherUserUID, myUserName, chatExists])

    const addChat = async (message, amount) => {

        var rightSideMessage = "Message: " + message + " Sending: " + amount + "ETHr";
        chatLog.unshift(rightSideMessage);
        // chatLog.push(rightSideMessage);
        var leftSideMessage = "Message: " + message + " Sending: " + amount + "ETHl";
        
        otherChatLog.unshift(leftSideMessage);
        // otherChatLog.push(leftSideMessage);
        
        const myData = {
            chatLog: chatLog,
        };
        
        const otherData = {
            chatLog: otherChatLog,
        };

        alert(otherData)
        chatRef.set(myData, (error) => {
            if (error) {
                alert("error writing to my chatLog");
            } else {
                alert("wrote to my chatLog");
            }
        });

        otherChatRef.set(otherData, (error) => {
            if (error) {
                alert("error writing to other chatLog");
            } else {
                alert("wrote to other chatLog");
            }
        });
        return;
    };

    const renderChats = ({ item }) => {
        var justifySide = "center";
        var bgColor = "#000fff";
        var fontColor = "#1e1c21";
        var sendingIndexStart = 14;
        var amountIndexStart = 5;
        var imageSize = Platform.OS === "web" ? 50 : 25;
        
        if (String(item).charAt(String(item).length - 1) == "r") {
            justifySide = "flex-end";
            bgColor = "#5c555e";
            fontColor = "#1e1c21";
            sendingIndexStart = 14;
            amountIndexStart = 5;
        } else {
            justifySide = "flex-start";
            bgColor = "#1e1c21";
            fontColor = '#79777d';
            sendingIndexStart = 14;
            amountIndexStart = 5;
        }


        return (
            <View style={[masterStyles.paymentFlatListContainer, { width: screenSize.width / 1.8, alignSelf: justifySide, backgroundColor: bgColor, flexDirection: "row", paddingLeft: 5}]}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{height: imageSize, width: imageSize, borderRadius: 50, backgroundColor: "#000"}}>
                        <Image style={{flex: 1, width: undefined, height: undefined, borderRadius: 50}} resizeMode={'contain'} resizeMethod={'scale'} source={require("../../../assets/Default_Img.png")} />
                    </View>
                    <View style={{ justifyContent: "center", paddingLeft: 5}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={[masterStyles.headingsSmall, {color: fontColor, fontSize: 14}]} >{" "}{String(item).substring(String(item).length - sendingIndexStart, String(item).length - amountIndexStart)}</Text>
                            <Text style={[masterStyles.headingsSmallNotBold, {paddingLeft: 5, color: fontColor, fontSize: 14}]} >{String(item).substring(String(item).length - amountIndexStart, String(item).length - 1)}</Text>
                        </View>
                        <View style={{width: screenSize.width/ 2 - 20, flexGrow: 1, flexDirection: 'row'}}>
                            {/* <Text style={[masterStyles.headingsSmall, {flexShrink: 1, paddingTop: 15, color: fontColor, fontSize: 14}]} >{String(item).substring(0, 9)}</Text> */}
                            <Text style={[masterStyles.headingsSmallNotBold, {flexShrink: 1, paddingLeft: 5, paddingTop: 15, color: fontColor, fontSize: 14}]} >{String(item).substring(9, String(item).length - 14)}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.OS === "web" ? 0 : 40}
            behavior={Platform.OS === "ios" ? "position" : "height" || Platform.OS === "android" ? "position" : "height"}
            style={{
                backgroundColor: "#1e1c21",
                alignItems: "center",
                flex: 1,
                paddingTop: 20,
            }}
            enabled={true}
        >
            <View
                style={{
                    backgroundColor: "#2e2b30",
                    width: screenSize.width - 20,
                    borderRadius: 4,
                    paddingBottom: 10,
                    alignItems: "center",
                    paddingTop: 10,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("UserAccountScreen", {
                            email: email,
                            fullName: fullName,
                            userName: userName,
                            address: address,
                        });
                    }}
                >
                    <Image
                        style={{
                            borderRadius: 50,
                            backgroundColor: "#000",
                            height: userImageSize,
                            width: userImageSize,
                            resizeMode: "contain",
                        }}
                        source={require("../../../assets/Default_Img.png")}
                    />
                </TouchableOpacity>

                <View
                    style={{
                        height: 1,
                        width: screenSize.width,
                        backgroundColor: "#1e1c21",
                        top: 10,
                    }}
                />
                <View
                    style={{
                        top: 20,
                        paddingBottom: 15,
                        width: screenSize.width - 30,
                        height: Platform.OS === "web" ? screenSize.height / 1.4 - 160 : Platform.OS === "android" ? screenSize.height / 1.54 - 140 : screenSize.height / 1.54 - 120,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <AutoScrollFlatList
                        data={chatLog}
                        renderItem={renderChats}
                        key={(item, index) => item + index}
                        keyExtractor={(item, index) => item + index}
                        removeClippedSubviews={true}
                        // key={(item) => item}
                        
                        contentContainerStyle={{flexDirection: 'column-reverse'}}
                        // inverted={true}

                        style={{
                            width: screenSize.width - 30,

                            backgroundColor: masterStyles.container.backgroundColor,
                            
                        }}
                    />
                </View>
                <TextInput
                    style={[masterStyles.input,
                    {
                        width: screenSize.width - 40,
                        paddingRight: 5,
                        marginTop: 29,
                    },
                    ]}
                    placeholder="Enter memo for transaction..."
                    keyboardType="default"
                    textAlign="left"
                    onChangeText={(text) => {
                        setMemoTI(text);
                        setMemo(text);
                    }}
                    value={memoTI}
                />
            </View>

            <View
                style={{
                    backgroundColor: "#2e2b30",
                    width: screenSize.width - 20,
                    paddingTop: 5,
                    borderRadius: 4,
                    justifyContent: "center",
                    alignItems: "center",
                    top: 15,
                    paddingBottom: 20,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: screenSize.width - 40,
                    }}
                >
                    <View style={{ justifyContent: "flex-start" }}>
                        <Text style={[masterStyles.headingsSmallNotBold, { paddingBottom: 5, fontSize: 18 }]}>
                            Available: {available}
                        </Text>
                    </View>
                    <View style={{ justifyContent: "flex-end" }}>
                        <Text style={[masterStyles.headingsSmallNotBold, { paddingBottom: 5, fontSize: 18, textAlign: "right" }]}>
                            Sending: {amountInput}
                        </Text>
                    </View>
                </View>

                <View style={{ alignItems: "center" }}>
                    <View
                        style={{
                            flexDirection: "row",
                            backgroundColor: "#fff",
                            borderRadius: 4,
                        }}
                    >
                        <Text
                            style={{
                                borderRadius: 4,
                                width: 40,
                                textAlign: "right",
                                alignSelf: "center",
                            }}
                        >
                            ETH:{" "}
                        </Text>
                        <TextInput
                            style={[
                                masterStyles.input,
                                {
                                    width: screenSize.width - 80,
                                    paddingRight: 5,
                                },
                            ]}
                            placeholder="Enter amount of ETH to send"
                            keyboardType="decimal-pad"
                            returnKeyType="done"
                            textAlign="left"
                            onFocus={() => changeAmountInput(0.0)}
                            onChangeText={(text) => {
                                setAmountTI(text);
                                var amount = 0.0;

                                if (text.includes(".", 0) || text.length == 0) {
                                    if (text.length == 0 || text.length == 1) {
                                        amount = 0.0;
                                    } else {
                                        amount += parseFloat(text);
                                    }
                                } else {
                                    amount = parseFloat(text);
                                }

                                if (amount > available) {
                                    amount = available;
                                }

                                changeAmountInput(amount);
                            }}
                            value={amountTI}
                        />
                    </View>

                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            top: 10,
                            flexDirection: "row",
                        }}
                    >
                        <CustomButton // send button
                            onPress={() => {
                                // if (amountInput == 0.0) {
                                //     if (Platform.OS === "web") {
                                //         window.alert(
                                //             "Trying to send 0.0ETH or invalid input"
                                //         );
                                //     } else {
                                //         alert(
                                //             "Trying to send 0.0ETH or invalid input"
                                //         );
                                //     }
                                // } else {
                                    Keyboard.dismiss();
                                    if (Platform.OS === "web") {
                                        // web
                                        if (window.confirm("You are trying to send ETH\nDo you wish to continue?")) {
                                            if (available == amountInput && available > 0.0) {
                                                if (window.confirm("Trying to send your full balance amount.\nDo you wish to continue?")) {                                               
                                                    setAmountTI("");
                                                    setMemoTI("");

                                                    changeAvailable(available - amountInput);
                                                    changeAmountInput(0.0);
                                                    sendingMessage = "Message: " + memo + "\nSending: " + amountInput + "ETH";

                                                    addChat(memo, amountInput);
                                                    alert(chatLog)
                                                }
                                            } else {
                                                setAmountTI("");
                                                setMemoTI("");

                                                changeAvailable(available - amountInput);
                                                changeAmountInput(0.0);
                                                sendingMessage = "Message: " + memo + " Sending: " + amountInput + "ETHr";
                                                
                                                addChat(memo, amountInput);
                                                alert(chatLog)
                                            }
                                        }
                                    } else {
                                        // mobile
                                        Alert.alert(
                                            "You are trying to send ETH",
                                            "Do you wish to continue?",
                                            [{
                                                text: "Yes",
                                                onPress: () => {
                                                    if (available == amountInput && available > 0.0) {
                                                        Alert.alert(
                                                            "Trying to send your full balance amount.",
                                                            "Do you wish to continue?",
                                                            [{
                                                                text: "Yes",
                                                                onPress: () => {
                                                                    setAmountTI("");
                                                                    setMemoTI("");

                                                                    changeAvailable(available - amountInput);
                                                                    changeAmountInput(0.0);
                                                                    sendingMessage = "Message: " + memo + "\nSending: " + amountInput + "ETH";

                                                                    addChat(memo, amountInput);
                                                                    alert(chatLog)
                                                                },
                                                            },
                                                            {
                                                                text: "No",
                                                                onPress: () =>
                                                                    console.log("Cancel Pressed"),
                                                                style: "cancel",
                                                            }],
                                                            { cancelable: true, }
                                                        );
                                                    } else {
                            // do all testing for sending messages here for mobile
                                                        setAmountTI("");
                                                        setMemoTI("");

                                                        changeAvailable(available - amountInput);
                                                        changeAmountInput(0.0);
                                                        sendingMessage = "Message: " + memo + "\nSending: " + amountInput + "ETH";

                                                        addChat(memo, amountInput);
                                                        alert(chatLog);
                                                    }
                                                },
                                            },
                                            {
                                                text: "No",
                                                onPress: () =>
                                                    console.log("Cancel Pressed"),
                                                style: "cancel",
                                            }],
                                            { cancelable: true }
                                        );
                                    }
                                // }
                            }}
                            text="Send"
                            color="#1e1c21"

                            // for when there is also a request button
                            // width={(screenSize.width - 50) / 2}

                            width={screenSize.width - 40}
                            height={screenSize.height * 0.045}
                        />

                        {/** request button */}
                        {/* <View style={{ width: 10 }} />

                        <CustomButton // request button
                            onPress={() => {
                                if (amountInput == 0.0) {
                                    if (Platform.OS === "web") {
                                        window.alert(
                                            "Trying to request 0.0ETH or invalid input"
                                        );
                                    } else {
                                        alert(
                                            "Trying to request 0.0ETH or invalid input"
                                        );
                                    }
                                } else {
                                    if (Platform.OS === "web") {
                                        // web
                                        if (
                                            window.confirm(
                                                "You are trying to request ETH\nDo you wish to continue?"
                                            )
                                        ) {
                                            setAmountTI("");
                                            setMemoTI("");

                                            // send request to other user

                                            sendingMessage =
                                                "Message: " +
                                                memo +
                                                "\nRequesting: " +
                                                amountInput +
                                                "ETH";
                                            alert(sendingMessage);
                                        }
                                    } else {
                                        // mobile
                                        Alert.alert(
                                            "You are trying to request ETH",
                                            "Do you wish to continue?",
                                            [
                                                {
                                                    text: "Yes",
                                                    onPress: () => {
                                                        setAmountTI("");
                                                        setMemoTI("");

                                                        // send request to other user

                                                        sendingMessage =
                                                            "Message: " +
                                                            memo +
                                                            "\nRequesting: " +
                                                            amountInput +
                                                            "ETH";
                                                        alert(sendingMessage);
                                                    },
                                                },
                                                {
                                                    text: "No",
                                                    onPress: () =>
                                                        console.log(
                                                            "Cancel Pressed"
                                                        ),
                                                    style: "cancel",
                                                },
                                            ],
                                            { cancelable: true }
                                        );
                                    }
                                }
                            }}
                            text="Request"
                            color="#1e1c21"
                            width={(screenSize.width - 50) / 2}
                            height={screenSize.height * 0.045}
                        /> */}
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
