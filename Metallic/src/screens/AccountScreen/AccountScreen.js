import React, { useState } from "react";
import {
    Image,
    Text,
    View,
    Dimensions,
    Platform,
    Alert,
    Linking,
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

export function AccountScreen(props) {
    const [userFullName, setFullName] = useState("");
    const [userEmail, setEmail] = useState("");
    const [userCreateDate, setCreateDate] = useState("");
    const [userName, setUserName] = useState("");
    const screenSize =
        Platform.OS === "web"
            ? Dimensions.get("window")
            : Dimensions.get("screen");
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
            setBalance((balance / 1000000000000000000).toString() + " Eth");
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

    const onLogoutPress = () => {
        console.log("logout?");
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: () => {
                        firebase
                            .auth()
                            .signOut()
                            .then(() => {})
                            .catch((error) => {
                                console.log(error);
                            });
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const onLogoutPressWeb = () => {
        firebase
            .auth()
            .signOut()
            .then(() => {
                alert("Logout Successful");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    var user = firebase.auth().currentUser;
    var db = firebase.firestore();
    var uid;
    if (user != null) {
        uid = user.uid;
        async function getUser(datab, userID) {
            var users = datab.collection("users");
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
            style={[
                masterStyles.mainBackground,
                { justifyContent: "center", paddingVertical: 20 },
            ]}
        >
            <View
                style={{
                    flex: 4,
                    backgroundColor: "#2e2b30",
                    width: screenSize.width - 20,
                    alignItems: "center",
                    borderRadius: 4,
                    justifyContent: "center",
                    paddingBottom: 5,
                }}
            >
                <Text
                    style={[
                        masterStyles.title,
                        {
                            textAlign: "center",
                        },
                    ]}
                >
                    My Account
                </Text>
                <Image
                    style={[
                        masterStyles.logo,
                        { borderRadius: 30, resizeMode: "cover" },
                    ]}
                    defaultSource={require("../../../assets/Default_Img.png")}
                    source={{ uri: imageUrl }}
                />
                <Text
                    style={[
                        masterStyles.headings,
                        {
                            bottom: screenSize.height * 0.005,
                            textAlign: "center",
                        },
                    ]}
                >
                    @{userName}
                </Text>
                <Text
                    style={[
                        masterStyles.headingsSmall,
                        {
                            bottom: screenSize.height * 0.005,
                            textAlign: "center",
                        },
                    ]}
                >
                    Name: {userFullName}
                </Text>
                <Text
                    style={[
                        masterStyles.headingsSmall,
                        {
                            bottom: screenSize.height * 0.005,
                            textAlign: "center",
                        },
                    ]}
                >
                    Email: {userEmail}
                </Text>
                <Text
                    style={[
                        masterStyles.headingsSmall,
                        {
                            bottom: screenSize.height * 0.005,
                            textAlign: "center",
                        },
                    ]}
                >
                    Balance: {balance}
                </Text>
                <Text
                    style={[
                        masterStyles.headingsSmall,
                        {
                            bottom: screenSize.height * 0.005,
                            textAlign: "center",
                        },
                    ]}
                >
                    Score: {score}
                </Text>

                <View
                    style={{
                        zIndex: 1,
                        paddingTop:
                            Platform.OS == "web" ? screenSize.height / 20 : 10,
                        paddingBottom: screenSize.height * 0.01,
                    }}
                >
                    <CustomButton
                        onPress={() => {
                            navigation.navigate("AccountDetailScreen");
                        }}
                        text="View Account Details"
                        color="#1e1c21"
                        width={screenSize.width - 80}
                        height={screenSize.height / 20}
                    />
                </View>

                <View
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
                </View>

                <View style={{ zIndex: 2 }} />
                <CustomButton
                    onPress={
                        Platform.OS === "web" ? onLogoutPressWeb : onLogoutPress
                    }
                    text="Logout"
                    color="#1e1c21"
                    width={screenSize.width - 80}
                    height={screenSize.height / 20}
                />
            </View>
        </View>
    );
}
