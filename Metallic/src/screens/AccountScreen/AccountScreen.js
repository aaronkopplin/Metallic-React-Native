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
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { firebase } from "../../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import CustomButton from "../../../button";
import { masterStyles } from '../../../../Metallic/masterStyles';

export function AccountScreen(props) {
    // const [entityText, setEntityText] = useState("");
    // const [entities, setEntities] = useState([]);

    // const entityRef = firebase.firestore().collection("entities");
    // const userID = props.extraData.id;
    // const navigation = useNavigation();

    // useEffect(() => {
    //     entityRef
    //         .where("authorID", "==", userID)
    //         .orderBy("createdAt", "desc")
    //         .onSnapshot(
    //             (querySnapshot) => {
    //                 const newEntities = [];
    //                 querySnapshot.forEach((doc) => {
    //                     const entity = doc.data();
    //                     entity.id = doc.id;
    //                     newEntities.push(entity);
    //                 });
    //                 setEntities(newEntities);
    //             },
    //             (error) => {
    //                 console.log(error);
    //             }
    //         );
    // }, []);

    const onLogoutPress = () => {
        console.log("Logout Pressed.");
        firebase
            .auth()
            .signOut()
            .then(() => {
                // alert("Logout Successful.");
            }).catch((error) => {
                console.log(error);
            });
    };

    return (
        <View>
            <TouchableOpacity
                onPress={onLogoutPress}
            >
                <Text> Logout </Text>
            </TouchableOpacity>
            <Text> Account Screen </Text>
        </View>
    );
}
