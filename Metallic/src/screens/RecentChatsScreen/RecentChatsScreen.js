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
import styles from "./styles";
import { firebase } from "../../firebase/config";
import CustomButton from "../../../button";
import { masterStyles } from "../../../masterStyles";
import { SafeAreaView } from "react-native-safe-area-context";

export function RecentChatsScreen({ navigation }) {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: masterStyles.mainBackground.backgroundColor}}>
        <View>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("Payments");
                }}
            >
                <Text style={{color: masterStyles.headings.color}}> Go To Paymets Screen </Text>
            </TouchableOpacity>
            <Text style={{color: masterStyles.headings.color}}> Hello recent chats </Text>
        </View>
        </SafeAreaView>
    );
}
