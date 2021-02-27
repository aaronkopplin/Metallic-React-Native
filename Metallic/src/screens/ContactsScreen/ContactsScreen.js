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
// import styles from "./styles";
import { firebase } from "../../firebase/config";
import CustomButton from "../../../button";
import { masterStyles } from '../../../../Metallic/masterStyles';

export function ContactsScreen({ navigation }) {
    return (
        <View style={masterStyles.mainBackground}>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("Account");
                }}
            >
                <Text> Go To Accounts Screen </Text>
            </TouchableOpacity>
            <Text> Hello Contacts </Text>
        </View>
    );
}
