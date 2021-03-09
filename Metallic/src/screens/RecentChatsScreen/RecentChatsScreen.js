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
import CustomButton from "../../../button";
import { masterStyles } from '../../../../Metallic/masterStyles';

export function RecentChatsScreen({ navigation }) {

    const screenSize = Platform.OS === "web" ? Dimensions.get("window") : Dimensions.get("screen");

    return (
        <View style={masterStyles.mainBackground}>
            <View style={
                masterStyles.mainBackground,
                {flex: 0.1}
            }></View>
            <View
                style={{
                    flex: 3,
                    backgroundColor: "#2e2b30",
                    width: screenSize.width - 40,
                    height: Platform.OS === "web" ? screenSize.height/2.5 : screenSize.width - 30,
                    paddingTop: screenSize.height / 50,
                    paddingLeft: 20,
                    borderRadius: 4,
                }}
            >
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("Payments");
                }}
            >
                <Text style={{color:'white'}}> Go To Payments Screen </Text>
            </TouchableOpacity>
            <View style={
                masterStyles.mainBackground,
                {flex: 0.5}
            }></View>
            </View>
        </View>
    );
}
