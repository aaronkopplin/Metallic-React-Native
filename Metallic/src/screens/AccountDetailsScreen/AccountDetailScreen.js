import React, { useState } from "react";
import { Text, View, Dimensions, Platform, StyleSheet } from "react-native";
import { masterStyles } from "../../../../Metallic/masterStyles";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as WalletFunctions from "../../ethereum/walletFunctions";
import { useEffect } from "react";
import QRCode from "react-native-qrcode-svg";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../styling/colors";
import * as FirebaseFunctions from "../../firebase/firebaseFunctions";

export function AccountDetailScreen(props) {
    const screenSize =
        Platform.OS === "web"
            ? Dimensions.get("window")
            : Dimensions.get("screen");
    const [address, setAddress] = useState("Loading");
    const [privateKey, setPrivateKey] = useState("Loading");
    const [mnemonic, setMnemonic] = useState("Loading");
    const [email, setEmail] = useState("Loading");
    const [name, setName] = useState("Loading");
    const navigation = useNavigation();

    useEffect(() => {
        async function grabData() {
            var data = await FirebaseFunctions.firebaseGetUserAccount();
            setAddress(data.address);
            setPrivateKey(data.privateKey);
            setMnemonic(data.mnemonic);
            setEmail(data.email);
            setName(data.name);
        }

        grabData();
    }, []);

    return (
        <View
            style={{
                flex: 4,
                backgroundColor: "#2e2b30",
                alignItems: "center",
            }}
        >
            <View style={styles.horizontalContainer}>
                <Text style={styles.boldLabel}>Name:</Text>
                <Text style={styles.label}>{name}</Text>
            </View>
            <View style={styles.horizontalContainer}>
                <Text style={styles.boldLabel}>Email:</Text>
                <Text style={styles.label}>{email}</Text>
            </View>
            <View style={styles.horizontalContainer}>
                <Text style={styles.boldLabel}>Address:</Text>
                <Text style={styles.label}>{address}</Text>
            </View>
            <View style={styles.horizontalContainer}>
                <Text style={styles.boldLabel}>Private Key:</Text>
                <Text style={styles.label}>{privateKey}</Text>
            </View>
            <View style={styles.horizontalContainer}>
                <Text style={styles.boldLabel}>Mnemonic:</Text>
                <Text style={styles.label}>{mnemonic}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    boldLabel: {
        fontSize: 20,
        color: Colors.lightForeground,
        fontWeight: "bold",
        width: "35%",
    },
    label: {
        fontSize: 20,
        color: Colors.lightForeground,
        width: "65%",
    },
    qrCode: {},
    horizontalContainer: {
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
        padding: 10,
    },
});
