import React, { useState } from "react";
import {
    Image,
    Text,
    View,
    Dimensions,
    Platform,
    Alert,
    Button,
} from "react-native";
import { firebase } from "../../firebase/config";
import CustomButton from "../../../button";
import { masterStyles } from "../../../../Metallic/masterStyles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";

// Import the ethers library
import { ethers } from "ethers";
import { useEffect } from "react";
import * as WalletFunctions from "../../ethereum/walletFunctions";
import * as ImagePicker from "expo-image-picker";
import storage from "@react-native-firebase/storage";
import "firebase/storage";
import { formatBytes32String } from "@ethersproject/strings";

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

    useEffect(() => {
        const fetchBal = async () => {
            const wallet = await WalletFunctions.loadWalletFromPrivate();
            const balance = await (
                await WalletFunctions.getBalance(wallet)
            ).toString();
            setBalance(balance);
        };

        // (async () => {
        //     if (Platform.OS !== 'web') {
        //       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        //       if (status !== 'granted') {
        //         alert('Sorry, we need camera roll permissions to make this work!');
        //       }
        //     }
        //   })();

        fetchBal();


    }, []);

    // if (perm && Platform.OS == "ios") {
        
    // }

    // Stutters to load correct image probably from multiple function calls?
    const ref = firebase.storage().ref('/' + userName + 'ProfileImage');
    ref.getDownloadURL().then(onResolve, onReject);
            
    // Found image for user
    function onResolve(foundUrl) {
        setImageUrl(foundUrl);
    }
    
    // Failed to find Image for user
    function onReject(error) {
        //console.log(error.code)
        var def = firebase.storage().ref('/DefaultImage.png');
        def.getDownloadURL().then((url) => {
            setImageUrl(url)}); 
    }

    const onChooseImagePress = async () => {
        let result = await ImagePicker.launchImageLibraryAsync();
    
        if (!result.cancelled) {
            let imageName = userName + 'ProfileImage';

            const response = await fetch(result.uri)
            const blob = await response.blob();
            var ref = firebase.storage().ref().child(imageName);
            ref.put(blob)

            setImageUrl(ref.getDownloadURL());
        }; 
    };

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
    };

    return (
        <View style={[masterStyles.mainBackground, {justifyContent: "center", paddingVertical: 20}]}>
            <View
                style={{
                    flex: 4,
                    backgroundColor: "#2e2b30",
                    width: screenSize.width - 20,
                    alignItems: "center",
                    borderRadius: 4,
                    justifyContent: "center",
                    paddingBottom: 5
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
                    style={[masterStyles.logo, { borderRadius: 30 }]}
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
                    {userName}
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
                    Account Age:
                </Text>
                
                <View
                    style={{
                        zIndex: 1,
                        paddingTop: Platform.OS == "web" ? screenSize.height / 20 : 10,
                        paddingBottom: screenSize.height * .01,
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
                        paddingBottom: screenSize.height * .01,
                    }}
                >
                <CustomButton
                    onPress={
                        onChooseImagePress
                    }
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
