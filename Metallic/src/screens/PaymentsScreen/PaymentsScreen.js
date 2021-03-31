import React, { useState } from "react";
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
// import { color } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import * as WalletFunctions from "../../ethereum/walletFunctions";
import { useEffect } from "react";

export function PaymentsScreen({ route }) {
    const screenSize =
        Platform.OS === "web"
            ? Dimensions.get("window")
            : Dimensions.get("screen");
    const [amountInput, changeAmountInput] = useState(0.0);
    const [available, changeAvailable] = useState(0.0);
    //const { email, fullName, userName } = route.params;

    const userImageSize = Platform.OS === "web" ? 75 : 50;
    var sendingMessage = "";
    const [memo, setMemo] = useState("");

    // memoTI and amountTI used to clear TextInput on pushing send/request button
    const [memoTI, setMemoTI] = useState("");
    const [amountTI, setAmountTI] = useState("");

    const navigation = useNavigation();

    useEffect(() => {
        const fetchBal = async () => {
            const wallet = await WalletFunctions.loadWalletFromPrivate();
            const balance = await (
                await WalletFunctions.getBalance(wallet)
            ).toString();
            changeAvailable(parseFloat(balance));
        };

        fetchBal();
    }, []);

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.OS === "android" ? 40 : 0}
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
                        navigation.navigate("Account");
                    }}
                >
                    <Image
                        style={{
                            borderRadius: 50,
                            backgroundColor: "#000",
                            height: userImageSize,
                            width: userImageSize,
                        }}
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
                        backgroundColor: "#fff",
                        width: screenSize.width - 30,
                        height:
                            Platform.OS === "web"
                                ? screenSize.height / 1.4 - 160
                                : Platform.OS === "android"
                                ? screenSize.height / 1.54 - 140
                                : screenSize.height / 1.54 - 120,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text>Display Chat</Text>
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
                            {" "}
                            Available: {available}{" "}
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
                            {" "}
                            Sending: {amountInput}{" "}
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
                                if (amountInput == 0.0) {
                                    if (Platform.OS === "web") {
                                        window.alert(
                                            "Trying to send 0.0ETH or invalid input"
                                        );
                                    } else {
                                        alert(
                                            "Trying to send 0.0ETH or invalid input"
                                        );
                                    }
                                } else {
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
                                                    alert(sendingMessage);
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
                                                alert(sendingMessage);
                                            }
                                        }
                                    } else {
                                        // mobile
                                        Alert.alert(
                                            "You are trying to send ETH",
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
                                                            Alert.alert(
                                                                "Trying to send your full balance amount.",
                                                                "Do you wish to continue?",
                                                                [
                                                                    {
                                                                        text:
                                                                            "Yes",
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
                                                                            alert(
                                                                                sendingMessage
                                                                            );
                                                                        },
                                                                    },
                                                                    {
                                                                        text:
                                                                            "No",
                                                                        onPress: () =>
                                                                            console.log(
                                                                                "Cancel Pressed"
                                                                            ),
                                                                        style:
                                                                            "cancel",
                                                                    },
                                                                ],
                                                                {
                                                                    cancelable: true,
                                                                }
                                                            );
                                                        } else {
                                                            setAmountTI("");
                                                            setMemoTI("");

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
                                                            alert(
                                                                sendingMessage
                                                            );
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
                                }
                            }}
                            text="Send"
                            color="#1e1c21"
                            width={(screenSize.width - 50) / 2}
                            height={screenSize.height * 0.045}
                        />

                        <View style={{ width: 10 }} />

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
                        />
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
