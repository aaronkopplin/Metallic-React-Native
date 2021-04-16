import React, { useState } from "react";
import {
    Image,
    Text,
    View,
    Dimensions,
    Platform,
    Alert,
    Button,
    Linking,
    MaskedViewBase,
} from "react-native";
import { firebase } from "../../firebase/config";
import CustomButton from "../../../button";
import { masterStyles } from "../../../../Metallic/masterStyles";
// import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { defaultImg } from "../../../assets/Default_Img.png"

// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";

// Import the ethers library
import { ethers } from "ethers";
import { useEffect } from "react";
import * as WalletFunctions from "../../ethereum/walletFunctions";
import * as ImagePicker from "expo-image-picker";
// import storage from "@react-native-firebase/storage";
import "firebase/storage";
import { formatBytes32String } from "@ethersproject/strings";

import * as Permissions from 'expo-permissions';

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
    const [imagePermission, setImagePermission] = useState()
    const [score, setScore] = useState()

    useEffect(() => {
        const fetchBal = async () => {
            const wallet = await WalletFunctions.loadWalletFromPrivate();
            const balance = await (
                await WalletFunctions.getBalance(wallet)
            ).toString();
            setBalance((balance / 1000000000000000000).toString() + " Eth");
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

    const onChooseImagePress = async () => {
        //alert(imagePermission)
        // alert((await Permissions.getAsync(Permissions.MEDIA_LIBRARY)).status);
        if (Platform.OS == 'ios' && imagePermission != 'granted') {
            if (imagePermission == null) {
                const x = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
                setImagePermission(x.status);
            }
             else if ((await Permissions.getAsync(Permissions.MEDIA_LIBRARY)).status != 'granted')  {
                Linking.openURL('app-settings:');
                return;
            }
        }
        if (Platform.OS != 'ios' || imagePermission == 'granted') {
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
        const getImage = async(userName) => {
            if (userName != ""){
                const ref = await firebase.storage().ref('/' + userName + 'ProfileImage');
                await ref.getDownloadURL().then(onResolve, onReject);
                async function onReject(error) {
                    //console.log(error.code)
                }
                async function onResolve(foundUrl) {
                    setImageUrl(foundUrl);
                }
            }
        }
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
                    scoreRef.update({ score: 0})
                    setScore(snap.data().score);
                } else {
                    setScore(snap.data().score);
                }
            })

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
        <View style={masterStyles.mainView}>
            <View style={masterStyles.accountContainer}>
                <Text style={masterStyles.accountMyAccount}>
                    My Account
                </Text>
                <Image
                    style={masterStyles.logo}
                    defaultSource={require("../../../assets/Default_Img.png")}
                    source={{ uri: imageUrl }}
                />
                <Text style={masterStyles.accountUserName}>
                    {userName}
                </Text>
                <Text style={masterStyles.accountDetails}>
                    Name: {userFullName}
                </Text>
                <Text style={masterStyles.accountDetails}>
                    Email: {userEmail}
                </Text>
                <Text style={masterStyles.accountDetails}>
                    Balance: {balance}
                </Text>
                <Text style={masterStyles.accountDetails}>
                    Score: {score}
                </Text>

                <View style={{height: screenSize.height *.07}} />

                <CustomButton
                    onPress={() => {
                        navigation.navigate("AccountDetailScreen");
                    }}
                    text="View Account Details"
                    color="#6111d1"
                    width={Platform.OS == "web" ? screenSize.width *.55 : screenSize.width * .8}
                    height={screenSize.height / 20}
                />

                <View style={{height: screenSize.height * .02}} /> 

                <CustomButton
                    onPress={() => {onChooseImagePress()}}
                    text="Change Profile Picture"
                    color="#117ed1"
                    width={Platform.OS == "web" ? screenSize.width *.55 : screenSize.width * .8}
                    height={screenSize.height / 20}
                />

                <View style={{height: screenSize.height * .02 }} />
                <CustomButton
                    onPress={
                        Platform.OS === "web" ? onLogoutPressWeb : onLogoutPress
                    }
                    text="Logout"
                    color="#000000"
                    width={Platform.OS == "web" ? screenSize.width *.55 : screenSize.width * .8}
                    height={screenSize.height / 20}
                />
            </View>
        </View>
    );
}
