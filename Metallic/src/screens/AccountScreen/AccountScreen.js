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
    
    const [imageUrl, setImageUrl] = useState(undefined);

    const ref = firebase.storage().ref('/' + userName + 'ProfileImage');
    ref.getDownloadURL()
        .then( (url) => {setImageUrl(url)})

/*     if (imageUrl == null){
        setImageUrl("../../../assets/Default_Img.png")
    } */


    const onChooseImagePress = async () => {
        let result = await ImagePicker.launchImageLibraryAsync();
    
        if (!result.cancelled) {
            let imageName = userName + 'ProfileImage';

            const response = await fetch(result.uri)
            const blob = await response.blob();
            var ref = firebase.storage().ref().child(imageName);
            ref.put(blob)
        }; 
    };

 
/*      const onChooseImagePress = async () => {
        let result = await ImagePicker.launchImageLibraryAsync();

        if (!result.cancelled) {
            let imageUri = result.uri;
            let imageName = result.fileName;

            console.log("base64 -> ", result.base64);
            console.log("uri -> ", result.uri);
            console.log("width -> ", result.width);
            console.log("height -> ", result.height);
            console.log("fileSize -> ", result.fileSize);
            console.log("type -> ", result.type);
            console.log("fileName -> ", result.fileName);
            setFilePath(result);

            uploadImage(imageUri, imageName);
        }
    };

    const uploadImage = async (uri, name) => {
        if (uri == null) {
            return null;
        }
        /* 
         const extension = filename.split('.').pop(); 
        const name = filename.split('.').slice(0, -1).join('.');
        filename = name + Date.now() + '.' + extension;

        firebase.storage().ref(name).put(uri);
    }; */

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
        <View style={masterStyles.mainBackground}>
            <View style={(masterStyles.mainBackground, { flex: 0.5 })} />
            <View
                style={{
                    flex: 4,
                    backgroundColor: "#2e2b30",
                    width: screenSize.width - 40,
                    height:
                        Platform.OS === "web"
                            ? screenSize.height / 2.5
                            : screenSize.width - 30,
                    paddingTop: screenSize.height / 50,
                    paddingBottom: screenSize.height / 50,
                    alignItems: "center",
                    borderRadius: 4,
                }}
            >
                <Text
                    style={[
                        masterStyles.title,
                        {
                            paddingBottom: screenSize.height * 0.005,
                            textAlign: "center",
                        },
                    ]}
                >
                    My Account
                </Text>
                <Image
                    style={[masterStyles.logo, { borderRadius: 50 }]}
                    source={{ uri: imageUrl }}
                />
                <Text
                    style={[
                        masterStyles.headings,
                        {
                            paddingBottom: screenSize.height * 0.005,
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
                            paddingBottom: screenSize.height * 0.005,
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
                            paddingBottom: screenSize.height * 0.005,
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
                            paddingBottom: screenSize.height * 0.005,
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
                            paddingBottom: screenSize.height * 0.005,
                            textAlign: "center",
                        },
                    ]}
                >
                    Account Age:
                </Text>
                
                <View
                    style={{
                        zIndex: 1,
                        paddingTop: screenSize.height / 20,
                        paddingBottom: screenSize.height / 70,
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
                        paddingBottom: screenSize.height / 70,
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

                <View style={{ zIndex: 2 }} />
            </View>
            <View
                style={{
                    zIndex: 1,
                    paddingTop: screenSize.height / 20,
                    paddingBottom: screenSize.height / 70,
                }}
            />
        </View>
    );
}
