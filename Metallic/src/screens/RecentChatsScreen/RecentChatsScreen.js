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
    return (
        <View style={masterStyles.mainBackground}>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("Payments");
                }}
            >
                <Text style={{color: masterStyles.headings.color}}> Go To Payments Screen </Text>
            </TouchableOpacity>
            <Text style={{color: masterStyles.headings.color}}> Hello recent chats </Text>
        </View>
    );
}
