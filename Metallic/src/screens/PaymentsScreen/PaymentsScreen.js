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
import { AutoScrollFlatList } from "react-native-autoscroll-flatlist";

export function PaymentsScreen({ route }) {
    const screenSize =
        Platform.OS === "web"
            ? Dimensions.get("window")
            : Dimensions.get("screen");
    const [amountInput, changeAmountInput] = useState(0.0);
    const [available, changeAvailable] = useState(0.0);
    const { email, fullName, userName, address, score } = route.params;
    const userImageSize = Platform.OS === "web" ? 75 : 50;
    var sendingMessage = "";
    const [memo, setMemo] = useState("");
    // memoTI and amountTI used to clear TextInput on pushing send/request button
    const [memoTI, setMemoTI] = useState("");
    const [amountTI, setAmountTI] = useState("");
    const navigation = useNavigation();
    const [chatLog, updateChatLog] = useState([]); // my chatLog
    const [otherChatLog, updateOtherChatLog] = useState([]); // chatLog of user I am sending a message to
    const [chatExists, setChatExists] = useState(Boolean); // used to confirm if a chat exists between me and the other user
    const user = firebase.auth().currentUser;
    const [myUserName, setMyUserName] = useState(""); // my username
    const [otherUserUID, setOtherUserUID] = useState(""); // other user's userID
    const [otherChatRef, setOtherChatRef] = useState(); // ref to other user's chats collection
    const [myScore, setMyScore] = useState();
    const [otherScore, setOtherScore] = useState();
    const [balance, setBalance] = useState(0); // will be big number

    const db = firebase.firestore();
    const chatRef = db
        .collection("users")
        .doc(user.uid)
        .collection("chats")
        .doc(String(userName));
    const otherRef = db
        .collection("users")
        .where("userName", "==", userName)
        .get();

    const scoreRef = db.collection("users").doc(user.uid);

    const [wallet, setWallet] = useState(null);
    const [recipientAddress, setRecipientAddress] = useState("");

    useEffect(() => {
        const fetchBal = async () => {
            const loadedWallet = await WalletFunctions.loadWalletFromPrivate();
            setWallet(loadedWallet);
            const retrievedBalance = await await WalletFunctions.getBalance(
                loadedWallet
            );
            changeAvailable(parseFloat(retrievedBalance.toString()));
            setBalance(retrievedBalance);
        };

        fetchBal();

        // get my username
        db.collection("users")
            .doc(user.uid)
            .onSnapshot((snap) => {
                setMyUserName(snap.data().userName);
                setMyScore(snap.data().score);
            });

        // get other user's userID
        const otherID = async () => {
            (await otherRef).forEach((doc) => {
                setOtherUserUID(doc.data().id);
                setRecipientAddress(doc.data().address);
                setOtherScore(score);
                return;
            });

            return;
        };
        otherID();
    }, []);

    useEffect(() => {
        if (otherUserUID != "" && myUserName != "") {
            // only runs this code if we have the other user's userID and my username

            const oc = db
                .collection("users")
                .doc(otherUserUID)
                .collection("chats");
            oc.doc(myUserName).onSnapshot((snap) => {
                if (snap.exists) {
                    // chat with other user exists
                    setOtherChatRef(snap.ref);
                    updateOtherChatLog(snap.data().chatLog);
                    setChatExists(true);
                } else {
                    // no existing chat with other user
                    oc.doc(myUserName).set({ chatLog: [] });
                    setOtherChatRef(snap.ref);
                }
            });

            // get my chatLog with other user
            chatRef.onSnapshot((snapshot) => {
                if (snapshot.exists) {
                    updateChatLog(snapshot.data().chatLog);
                    setChatExists(true);
                }
            });
        }
    }, [otherUserUID, myUserName, chatExists]);
    // re-run this useEffect if any of the above three variables change value

    function getImage(item) {
        if (item.indexOf("ETHl") == -1) {
            return (
                "https://storage.googleapis.com/metallic-975be.appspot.com/" +
                myUserName +
                "ProfileImage"
            );
        } else {
            return (
                "https://storage.googleapis.com/metallic-975be.appspot.com/" +
                userName +
                "ProfileImage"
            );
        }
    }

    // add chat to my and other user's chatLogs on firebase when sending a message/payment
    const addChat = async (message, amount) => {
        // message that i sent and will go in my chatLog
        var rightSideMessage =
            "Message: " + message + " Sending: " + amount + "ETHr";
        chatLog.unshift(rightSideMessage);

        // message that i sent and will go in the other user's chatLog
        var leftSideMessage =
            "Message: " + message + " Sending: " + amount + "ETHl";
        otherChatLog.unshift(leftSideMessage);

        const myData = {
            chatLog: chatLog,
        };

        const otherData = {
            chatLog: otherChatLog,
        };

        // push my message to my chatLog on firebase
        chatRef.set(myData, (error) => {
            if (error) {
                alert("error writing to my chatLog");
            } else {
                alert("wrote to my chatLog");
            }
        });

        // push my message to the other user's chatLog on firebase
        otherChatRef.set(otherData, (error) => {
            if (error) {
                alert("error writing to other chatLog");
            } else {
                alert("wrote to other chatLog");
            }
        });

        // update my and other user's score
        var newScore = myScore + 1;
        setMyScore(newScore);
        scoreRef.update({ score: newScore }, (e) => {
            alert(e);
        });

        var otherNewScore = score + 1;
        setOtherScore(otherNewScore);
        db.collection("users")
            .doc(otherUserUID)
            .update({ score: otherNewScore }, (e) => {
                alert(e);
            });

        // send the transaction
        if (amount < balance) {
            async function callSendPayment() {
                var response = await WalletFunctions.sendPayment(
                    wallet,
                    amount,
                    recipientAddress
                );
                if (response != "") {
                    alert(
                        "There was an error sending the payment. Please check that you have sufficient funds to make this payment and try again in a few minutes. "
                    );
                }
            }

            callSendPayment();
        } else if (amount != 0) {
            alert("insufficient funds");
        }
        // alert(rightSideMessage);
    };

    const renderChats = ({ item }) => {
        var justifySide = "center";
        var bgColor = "#000fff";
        var fontColor = "#1e1c21";
        var sendingIndexStart = String(item).lastIndexOf("Sending: ");
        var imageSize = Platform.OS === "web" ? 50 : 25;
        // set variables accordingly to if the chat was sent by me or the other user
        if (String(item).charAt(String(item).length - 1) == "r") {
            justifySide = "flex-end";
            bgColor = "#5c555e";
            fontColor = "#1e1c21";
        } else {
            justifySide = "flex-start";
            bgColor = "#1e1c21";
            fontColor = "#79777d";
        }

        return (
            <View
                style={[
                    masterStyles.paymentFlatListContainer,
                    {
                        width: screenSize.width / 1.8,
                        alignSelf: justifySide,
                        backgroundColor: bgColor,
                        flexDirection: "row",
                        paddingLeft: 5,
                    },
                ]}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            height: imageSize,
                            width: imageSize,
                            borderRadius: 50,
                            backgroundColor: "#000",
                        }}
                    >
                        <Image
                            style={{
                                flex: 1,
                                width: undefined,
                                height: undefined,
                                borderRadius: 50,
                            }}
                            resizeMode={"cover"}
                            resizeMethod={"scale"}
                            defaultSource={require("../../../assets/Default_Img.png")}
                            source={{ uri: getImage(item) }}
                        />
                    </View>

                    <View style={{ justifyContent: "center", paddingLeft: 5 }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text
                                style={[
                                    masterStyles.headingsSmall,
                                    { color: fontColor, fontSize: 14 },
                                ]}
                            >
                                {String(item).substring(
                                    sendingIndexStart,
                                    sendingIndexStart +
                                        String("Sending:").length
                                )}
                            </Text>
                            <Text
                                style={[
                                    masterStyles.headingsSmallNotBold,
                                    {
                                        color: fontColor,
                                        fontSize: 14,
                                    },
                                ]}
                            >
                                {String(item).substring(
                                    sendingIndexStart +
                                        String("Sending:").length,
                                    String(item).length - 1
                                )}
                            </Text>
                        </View>

                        <View
                            style={{
                                width: screenSize.width / 2 - 20,
                                flexGrow: 1,
                                flexDirection: "row",
                            }}
                        >
                            <Text
                                style={[
                                    masterStyles.headingsSmallNotBold,
                                    {
                                        flexShrink: 1,
                                        paddingTop: 15,
                                        color: fontColor,
                                        fontSize: 14,
                                        overflow: "hidden",
                                    },
                                ]}
                            >
                                {String(item).substring(
                                    String("Message:").length + 1,
                                    sendingIndexStart
                                )}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.OS === "web" ? 0 : 40}
            behavior={
                Platform.OS === "ios"
                    ? "position"
                    : "height" || Platform.OS === "android"
                    ? "position"
                    : "height"
            }
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
                        navigation.navigate("ViewOtherAccount", {
                            email: email,
                            fullName: fullName,
                            userName: userName,
                            address: address,
                            score: otherScore,
                        });
                    }}
                    style={{ alignItems: "center", justifyContent: "center" }}
                >
                    <Image
                        style={{
                            borderRadius: 50,
                            height: userImageSize - 10,
                            width: userImageSize - 10,
                            resizeMode: "cover",
                            backgroundColor: "#000",
                        }}
                        defaultSource={require("../../../assets/Default_Img.png")}
                        source={{
                            uri:
                                "https://storage.googleapis.com/metallic-975be.appspot.com/" +
                                userName +
                                "ProfileImage",
                        }}
                    />

                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "#fff",
                            maxWidth: screenSize.width - 40,
                            paddingTop: 5,
                        }}
                    >
                        {userName}
                    </Text>
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
                        height:
                            Platform.OS === "web"
                                ? screenSize.height / 1.4 - 160
                                : Platform.OS === "android"
                                ? screenSize.height / 1.54 - 160
                                : screenSize.height / 1.54 - 120,
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
                        contentContainerStyle={{
                            flexDirection: "column-reverse",
                        }}
                        // inverted={true}

                        style={{
                            width: screenSize.width - 30,

                            backgroundColor:
                                masterStyles.container.backgroundColor,
                        }}
                    />
                </View>
                <TextInput
                    style={[
                        masterStyles.input,
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
                        <Text
                            style={[
                                masterStyles.headingsSmallNotBold,
                                { paddingBottom: 5, fontSize: 18 },
                            ]}
                        >
                            Available:{" "}
                            {(
                                parseFloat(available) / 1000000000000000000
                            ).toString() + " Eth"}
                        </Text>
                    </View>
                    <View style={{ justifyContent: "flex-end" }}>
                        <Text
                            style={[
                                masterStyles.headingsSmallNotBold,
                                {
                                    paddingBottom: 5,
                                    fontSize: 18,
                                    textAlign: "right",
                                },
                            ]}
                        >
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
                            autoCompleteType="off"
                            autoCorrect={false}
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
                                    if (
                                        window.confirm(
                                            "You are trying to send ETH\nDo you wish to continue?"
                                        )
                                    ) {
                                        if (
                                            available == amountInput &&
                                            available > 0.0
                                        ) {
                                            if (
                                                window.confirm(
                                                    "Trying to send your full balance amount.\nDo you wish to continue?"
                                                )
                                            ) {
                                                setAmountTI("");
                                                setMemoTI("");

                                                changeAvailable(
                                                    available - amountInput
                                                );
                                                changeAmountInput(0.0);
                                                sendingMessage =
                                                    "Message: " +
                                                    memo +
                                                    "\nSending: " +
                                                    amountInput +
                                                    "ETH";

                                                addChat(memo, amountInput);
                                                // alert(chatLog)
                                            }
                                        } else {
                                            setAmountTI("");
                                            setMemoTI("");

                                            changeAvailable(
                                                available - amountInput
                                            );
                                            changeAmountInput(0.0);
                                            sendingMessage =
                                                "Message: " +
                                                memo +
                                                "\nSending: " +
                                                amountInput +
                                                "ETH";

                                            addChat(memo, amountInput);
                                            // alert(chatLog)
                                        }
                                    } else {
                                        setAmountTI("");
                                        setMemoTI("");

                                        changeAvailable(
                                            available - amountInput
                                        );
                                        changeAmountInput(0.0);
                                        sendingMessage =
                                            "Message: " +
                                            memo +
                                            " Sending: " +
                                            amountInput +
                                            "ETHr";

                                        addChat(memo, amountInput);
                                        alert(chatLog);
                                    }
                                } else {
                                    // mobile
                                    Alert.alert(
                                        "You are trying to send ETH!",
                                        "Do you wish to continue?",
                                        [
                                            {
                                                text: "Yes",
                                                onPress: () => {
                                                    if (
                                                        available ==
                                                            amountInput &&
                                                        available > 0.0
                                                    ) {
                                                        alert(
                                                            "Trying to send your full balance amount.",
                                                            "Do you wish to continue?",
                                                            [
                                                                {
                                                                    text: "Yes",
                                                                    onPress: () => {
                                                                        setAmountTI(
                                                                            ""
                                                                        );
                                                                        setMemoTI(
                                                                            ""
                                                                        );

                                                                        changeAvailable(
                                                                            available -
                                                                                amountInput
                                                                        );
                                                                        changeAmountInput(
                                                                            0.0
                                                                        );
                                                                        sendingMessage =
                                                                            "Message: " +
                                                                            memo +
                                                                            "\nSending: " +
                                                                            amountInput +
                                                                            "ETH";

                                                                        addChat(
                                                                            memo,
                                                                            amountInput
                                                                        );
                                                                        // alert(chatLog)
                                                                    },
                                                                },
                                                            ],
                                                            { cancelable: true }
                                                        );
                                                    } else {
                                                        setAmountTI("");
                                                        setMemoTI("");

                                                        changeAvailable(
                                                            available -
                                                                amountInput
                                                        );
                                                        changeAmountInput(0.0);
                                                        sendingMessage =
                                                            "Message: " +
                                                            memo +
                                                            "\nSending: " +
                                                            amountInput +
                                                            "ETH";

                                                        addChat(
                                                            memo,
                                                            amountInput
                                                        );
                                                        // alert(chatLog);
                                                    }
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
