import React, { useState } from "react";
import { Image, Text, View, Dimensions, Platform, Alert, Button } from "react-native";
import { firebase } from "../../firebase/config";
import CustomButton from "../../../button";
import { masterStyles } from "../../../../Metallic/masterStyles";
import { TouchableOpacity } from "react-native-gesture-handler";

import * as ImagePicker from 'expo-image-picker';
import 'firebase/storage';

export function AccountScreen( props ) {
    const [userFullName, setFullName] = useState("");
    const [userEmail, setEmail] = useState("");
    const [userCreateDate, setCreateDate] = useState("");
    const [userName, setUserName] = useState("");
    const [imageUrl, setImageUrl] = useState(undefined);
    const screenSize = Platform.OS === "web" ? Dimensions.get("window") : Dimensions.get("screen");

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

    const onLogoutPress = () => {
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
            <View style={(masterStyles.mainBackground, { flex: 0.5 })}></View>
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
                    alignItems: "center",
                    borderRadius: 4,
                }}
            >
            
            <Text style={[masterStyles.title, {paddingBottom: screenSize.height * .005, textAlign: 'center'}]}>My Account</Text>
            
            <Image
                style={[masterStyles.logo, {borderRadius: 50}]} 
                //source={require("../../../assets/Default_Img.png")}
                source={{ uri: imageUrl }}
            />

            <Button title="Choose image..." onPress={onChooseImagePress} />

            <Text style={[masterStyles.headings, {paddingBottom: screenSize.height * .005, textAlign: 'center'}]}>{userName}</Text>
            <Text style={[masterStyles.headingsSmall, {paddingBottom: screenSize.height * .005, textAlign: 'center'}]}>Name: {userFullName}</Text>
            <Text style={[masterStyles.headingsSmall, {paddingBottom: screenSize.height * .005, textAlign: 'center'}]}>Email: {userEmail}</Text>
            <Text style={[masterStyles.headingsSmall, {paddingBottom: screenSize.height * .005, textAlign: 'center'}]}>Balance:</Text>
            <Text style={[masterStyles.headingsSmall, {paddingBottom: screenSize.height * .005, textAlign: 'center'}]}>Account Age:</Text>
            <Text
                    style={[
                        masterStyles.headingsSmall,
                        {
                            paddingBottom: screenSize.height * 0.005,
                            textAlign: "center",
                        },
                    ]}
                >
                    Public Key: {props.ethAccount.address}
                    {/* Public Key: test */}
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
                    Private Key: {props.ethAccount.privateKey}
                    {/* Private Key: test also */}
                </Text>
            <View
                    style={{
                        zIndex: 1,
                        paddingTop: screenSize.height / 20,
                        paddingBottom: screenSize.height / 70,
                    }}
                >

                    <CustomButton
                        onPress={
                            Platform.OS === "web"
                                ? onLogoutPressWeb
                                : onLogoutPress
                        }
                        text="Logout"
                        color="#1e1c21"
                        width={screenSize.width - 80}
                        height={screenSize.height / 20}
                    />

                    {/* <CustomButton
                        onPress={() => {
                            navigation.navigate("ContactSearch");
                        }}
                        text="To Contact Search"
                        color="#1e1c21"
                        width={screenSize.width - 80}
                        height={screenSize.height / 20}
                    /> */}
                </View>
            </View>

            <View style={(masterStyles.mainBackground, { flex: 0.5 })}></View>
        </View>
    );
}
