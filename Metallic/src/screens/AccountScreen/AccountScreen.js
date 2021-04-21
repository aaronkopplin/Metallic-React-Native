import React, { useState } from "react";
import {
    Image,
    Text,
    View,
    Dimensions,
    Modal,
    Platform,
    Alert,
    Linking,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { firebase } from "../../firebase/config";
import { useEffect } from "react";
import * as WalletFunctions from "../../ethereum/walletFunctions";
import * as ImagePicker from "expo-image-picker";
import "firebase/storage";
import * as Permissions from "expo-permissions";
import Icon from "react-native-vector-icons/Ionicons";
import * as FirebaseFunctions from "../../firebase/firebaseFunctions";
import { Colors } from "../../styling/colors";
import QRCode from "react-native-qrcode-svg";
import { useFocusEffect } from "@react-navigation/native";
import { masterStyles } from "../../../../Metallic/masterStyles";

export function AccountScreen({ navigation, route }) {
    const [userFullName, setFullName] = useState("");
    const [userEmail, setEmail] = useState("");
    const [userCreateDate, setCreateDate] = useState("");
    const [userName, setUserName] = useState("");
    // const navigation = useNavigation();
    const [balance, setBalance] = useState("Loading");
    const [imageUrl, setImageUrl] = useState(undefined);
    const [imagePermission, setImagePermission] = useState();
    const [score, setScore] = useState();
    const [userAddress, setUserAddress] = useState("");
    const [addContactButtonText, setAddContactButtonText] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [qrModalLabelText, setQrModalLabelText] = useState("");
    const [refresh, setRefresh] = useState("");
    const [imageLoading, setImageLoading] = useState(false);
    const [localImageUri, setLocalImageUri] = useState("");

    useFocusEffect(() => {
        console.log("refreshing account screen");
        setRefresh("");
    });

    useEffect(() => {
        if (route.params == null) {
            //view my own profile
            async function loadProfileData() {
                var data = await FirebaseFunctions.firebaseGetUserAccount();
                setFullName(data.name);
                setUserName(data.userName);
                setScore(data.score);
                setUserAddress(data.address);

                const wallet = await WalletFunctions.loadWalletFromPrivate();
                const balance = await (
                    await WalletFunctions.getBalance(wallet)
                ).toString();
                setBalance((balance / 1000000000000000000).toString());
            }

            setQrModalLabelText("Your Ethereum Address");
            loadProfileData();
        } else {
            //viewing other persons profile
            async function getBalance() {
                var bal = await WalletFunctions.getBalanceFromAddress(
                    route.params.address
                );
                setBalance((bal / 1000000000000000000).toString());
            }

            async function checkContact() {
                var isContact = await FirebaseFunctions.firebaseIsContact(
                    userName
                );
                if (isContact) {
                    setAddContactButtonText("Remove Contact");
                } else {
                    setAddContactButtonText("Add Contact");
                }
            }

            checkContact();
            getBalance();
            setFullName(route.params.fullName);
            setUserName(route.params.userName);
            setScore(route.params.score);
            setEmail(route.params.email);
            setUserAddress(route.params.address);
            setQrModalLabelText("@" + userName + "'s\nEthereum address");
        }
    });

    useEffect(() => {
        // Failed to find Image for user
        const getImage = async (userName) => {
            if (userName != "") {
                const ref = await firebase
                    .storage()
                    .ref("/" + userName + "ProfileImage");
                await ref.getDownloadURL().then(onResolve, onReject);
                async function onReject(error) {
                    // console.log(error);
                }
                async function onResolve(foundUrl) {
                    setImageUrl(foundUrl);
                }
            }
        };
        getImage(userName);
    }, [userName, imageUrl]);

    const onChooseImagePress = async () => {
        if (Platform.OS == "ios" && imagePermission != "granted") {
            if (imagePermission == null) {
                const x = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
                setImagePermission(x.status);
            } else if (
                (await Permissions.getAsync(Permissions.MEDIA_LIBRARY))
                    .status != "granted"
            ) {
                Linking.openURL("app-settings:");
                return;
            }
        }
        if (Platform.OS != "ios" || imagePermission == "granted") {
            let result = await ImagePicker.launchImageLibraryAsync();
            setLocalImageUri(result.uri);
            setImageLoading(true);
            if (!result.cancelled) {
                let imageName = userName + "ProfileImage";

                const response = await fetch(result.uri);
                const blob = await response.blob();
                var ref = firebase.storage().ref().child(imageName);
                ref.put(blob).then((snapshot) => {
                    console.log("added profile image");
                    async function downloadAndSetUrl() {
                        var url = await ref.getDownloadURL();
                        setImageUrl(url);
                        setImageLoading(false);
                        console.log("setting profile image");
                    }
                    downloadAndSetUrl();
                });
            }
        }
    };

    async function addOrRemoveContact() {
        var isContact = await FirebaseFunctions.firebaseIsContact(userName);

        if (!isContact) {
            // add contact
            const newContactData = {
                email: userEmail,
                fullName: userFullName,
                userName: userName,
                address: userAddress,
                score: score,
            };

            try {
                await FirebaseFunctions.firebaseAddContact(newContactData);
                setAddContactButtonText("Remove Contact");
            } catch (error) {
                alert("Couldn't add contact.");
                console.log(error);
            }
        } else {
            try {
                await FirebaseFunctions.firebaseRemoveContact(userName);
                setAddContactButtonText("Add Contact");
                console.log("Contact removed");
            } catch (error) {
                console.log(error);
                alert("Couldn't remove contact.");
            }
        }
    }
    function sendPayment() {
        navigation.navigate("Payments", {
            email: userEmail,
            fullName: userFullName,
            userName: userName,
            address: userAddress,
            score: score,
        });
    }
    return (
        <View style={masterStyles.mainView}>
            <View style={[masterStyles.accountContainer]}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={[styles.centeredView]}>
                        <View style={styles.modalView}>
                            <Text style={styles.label}>{qrModalLabelText}</Text>
                            <QRCode
                                value={userAddress}
                                style={styles.qrCode}
                                size={200}
                            />
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={styles.label}>Dismiss</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                {route.params == null ? (
                    <View style={styles.horizontalContainer}>
                        <TouchableOpacity
                            onPress={FirebaseFunctions.firebaseLogout}
                        >
                            <Icon
                                name="log-out-outline"
                                color="#79777d"
                                size={30}
                                style={styles.iconButton}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("AccountDetailScreen");
                            }}
                        >
                            <Icon
                                name="settings"
                                color="#79777d"
                                size={30}
                                style={styles.iconButton}
                            />
                        </TouchableOpacity>
                    </View>
                ) : null}
                <View style={styles.avitar}>
                    <Image
                        style={{
                            width: 200,
                            height: 200,
                            borderRadius: 1000,
                        }}
                        defaultSource={require("../../../assets/Default_Img.png")}
                        source={{
                            uri: imageLoading ? localImageUri : imageUrl,
                        }}
                        onPress={() => {
                            console.log("press");
                        }}
                    />
                    {route.params == null ? (
                        <Icon
                            name="camera"
                            color="#79777d"
                            size={25}
                            style={styles.cameraButton}
                            onPress={() => {
                                onChooseImagePress();
                            }}
                        />
                    ) : null}
                    <Icon
                        name="qr-code"
                        color="#79777d"
                        size={25}
                        style={styles.qrCodeButton}
                        onPress={() => {
                            console.log(userAddress);
                            setModalVisible(true);
                        }}
                    />
                </View>
                <Text style={styles.name}>{userFullName}</Text>
                <View style={styles.horizontalContainer}>
                    <Text style={styles.label}>@{userName}</Text>
                    <Text style={styles.label}>{balance} Eth</Text>
                    <Text style={styles.label}>{score} points</Text>
                </View>
                {route.params == null ? (
                    <Text></Text>
                ) : (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={addOrRemoveContact}
                        >
                            <Text style={styles.label}>
                                {addContactButtonText}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={sendPayment}
                        >
                            <Text style={styles.label}>Send Payment</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    qrCode: {},
    modalView: {
        // margin: 5,
        backgroundColor: Colors.lightBackground,
        borderRadius: 5,
        padding: 15,
        alignItems: "center",
        width: 300,
        height: 350,
        justifyContent: "center",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    centeredView: {
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
    actionButton: {
        width: "50%",
        color: "white",
    },
    avitar: {
        flexDirection: "row",
        alignItems: "baseline",
        width: 200,
        paddingTop: 10,
    },
    cameraButton: {
        position: "absolute",
        right: 0,
        bottom: 0,
    },
    qrCodeButton: {
        position: "absolute",
        left: 0,
        bottom: 0,
    },
    horizontalContainer: {
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
        padding: 10,
        borderBottomColor: Colors.lightForeground,
        borderBottomWidth: 1,
    },
    modalButton: {
        marginTop: 10,
        backgroundColor: Colors.darkBackground,
        borderRadius: 5,
        width: "60%",
    },
    button: {
        backgroundColor: Colors.darkBackground,
        borderRadius: 5,
        width: "45%",
    },
    buttonContainer: {
        justifyContent: "space-evenly",
        flexDirection: "row",
        width: "100%",
        padding: 10,
    },
    iconButton: {
        padding: 5,
    },
    name: {
        paddingTop: 5,
        fontSize: 30,
        fontWeight: "bold",
        color: Colors.lightForeground,
    },
    label: {
        padding: 5,
        fontSize: 20,
        color: Colors.lightForeground,
        textAlign: "center",
    },
});
