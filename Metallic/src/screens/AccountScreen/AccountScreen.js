import React, { useState } from "react";
import {
    Image,
    Text,
    View,
    Dimensions,
    Platform,
    Alert,
    Linking,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { firebase } from "../../firebase/config";
import CustomButton from "../../../button";
import { masterStyles } from "../../../../Metallic/masterStyles";
import { useNavigation } from "@react-navigation/native";
import { defaultImg } from "../../../assets/Default_Img.png";
import { useEffect } from "react";
import * as WalletFunctions from "../../ethereum/walletFunctions";
import * as ImagePicker from "expo-image-picker";
import "firebase/storage";
import { formatBytes32String } from "@ethersproject/strings";
import * as Permissions from "expo-permissions";
import Icon from "react-native-vector-icons/Ionicons";
import * as FirebaseFunctions from "../../firebase/firebaseFunctions";
import { Colors } from "../../styling/colors";

export function AccountScreen(props) {
    const [userFullName, setFullName] = useState("");
    const [userEmail, setEmail] = useState("");
    const [userCreateDate, setCreateDate] = useState("");
    const [userName, setUserName] = useState("");
    // const screenSize =
    //     Platform.OS === "web"
    //         ? Dimensions.get("window")
    //         : Dimensions.get("screen");
    const navigation = useNavigation();
    const [balance, setBalance] = useState("Loading");
    const [imageUrl, setImageUrl] = useState(undefined);
    const [imagePermission, setImagePermission] = useState();
    const [score, setScore] = useState();

    useEffect(() => {
        const fetchBal = async () => {
            const wallet = await WalletFunctions.loadWalletFromPrivate();
            const balance = await (
                await WalletFunctions.getBalance(wallet)
            ).toString();
            setBalance((balance / 1000000000000000000).toString());
        };

        fetchBal();
    }, []);

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

            if (!result.cancelled) {
                let imageName = userName + "ProfileImage";

                const response = await fetch(result.uri);
                const blob = await response.blob();
                var ref = firebase.storage().ref().child(imageName);
                ref.put(blob);

                setImageUrl(ref.getDownloadURL());
            }
        }
    };

    useEffect(() => {
        // Failed to find Image for user
        const getImage = async (userName) => {
            if (userName != "") {
                const ref = await firebase
                    .storage()
                    .ref("/" + userName + "ProfileImage");
                await ref.getDownloadURL().then(onResolve, onReject);
                async function onReject(error) {
                    //console.log(error.code)
                }
                async function onResolve(foundUrl) {
                    setImageUrl(foundUrl);
                }
            }
        };
        getImage(userName);
    }, [userName, imageUrl]);

    // const onLogoutPress = () => {
    //     console.log("logout?");
    //     Alert.alert(
    //         "Logout",
    //         "Are you sure you want to logout?",
    //         [
    //             {
    //                 text: "Cancel",
    //                 onPress: () => console.log("Cancel Pressed"),
    //                 style: "cancel",
    //             },
    //             {
    //                 text: "OK",
    //                 onPress: () => {
    //                     firebase
    //                         .auth()
    //                         .signOut()
    //                         .then(() => {})
    //                         .catch((error) => {
    //                             console.log(error);
    //                         });
    //                 },
    //             },
    //         ],
    //         { cancelable: false }
    //     );
    // };

    // const onLogoutPressWeb = () => {
    //     firebase
    //         .auth()
    //         .signOut()
    //         .then(() => {
    //             alert("Logout Successful");
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // };

    var user = firebase.auth().currentUser;
    var db = firebase.firestore();
    var uid;
    if (user != null) {
        uid = user.uid;
        async function getUser(db, userID) {
            var users = db.collection("users");
            const snapshot = await users.where("id", "==", userID).get();

            var scoreRef = db.collection("users").doc(uid);

            scoreRef.onSnapshot((snap) => {
                if (snap.data().score == undefined) {
                    scoreRef.update({ score: 0 });
                    setScore(snap.data().score);
                } else {
                    setScore(snap.data().score);
                }
            });

            if (snapshot.empty) {
                alert("no matching");
                return;
            }

            snapshot.forEach((doc) => {
                setFullName(doc.data().fullName);
                setEmail(doc.data().email);
                setCreateDate(user.metadata.creationTime);
                setUserName(doc.data().userName);

                return doc;
            });
        }
        getUser(db, uid);
    }

    return (
        <View
            style={{
                flex: 4,
                backgroundColor: "#2e2b30",
                alignItems: "center",
            }}
        >
            <View style={styles.horizontalContainer}>
                <TouchableOpacity onPress={FirebaseFunctions.firebaseLogout}>
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
            <View style={styles.avitar}>
                <Image
                    style={{
                        width: 200,
                        height: 200,
                        borderRadius: 1000,
                    }}
                    defaultSource={require("../../../assets/Default_Img.png")}
                    source={{ uri: imageUrl }}
                    onPress={() => {
                        console.log("press");
                    }}
                />
                <Icon
                    name="camera"
                    color="#79777d"
                    size={25}
                    style={styles.cameraButton}
                    onPress={() => {
                        onChooseImagePress();
                    }}
                />
            </View>
            <Text style={styles.name}>{userFullName}</Text>
            <View style={styles.horizontalContainer}>
                <Text style={styles.label}>@{userName}</Text>
                <Text style={styles.label}>{balance} Eth</Text>
                <Text style={styles.label}>{score} points</Text>
            </View>

            {/* <Text style={styles.label}>{userEmail}</Text> */}

            {/* <View
                style={{
                    zIndex: 1,
                    paddingBottom: screenSize.height * 0.01,
                }}
            >
                <CustomButton
                    onPress={() => {
                        onChooseImagePress();
                    }}
                    text="Change Profile Picture"
                    color="#1e1c21"
                    width={screenSize.width - 80}
                    height={screenSize.height / 20}
                />
            </View> */}

            <View style={{ zIndex: 2 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    avitar: {
        flexDirection: "row",
        alignItems: "baseline",
        width: 200,
        paddingTop: 10,
        // backgroundColor: "red",
    },
    cameraButton: {
        position: "absolute",
        right: 0,
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
    },
});
