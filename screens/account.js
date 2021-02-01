import * as React from "react";
import { Button, Text, View, Image } from "react-native";

function AccountScreen() {
    return (
        <View style={styles.container}>
            <Image
                style={styles.banner}
                source={require("../assets/wallpaper.jpeg")}
            />
            <View style={styles.aviView}>
                <Image
                    style={styles.avi}
                    source={require("../assets/avi.jpeg")}
                />
            </View>
            <View style={styles.usernameContainer}>
                <Text style={styles.username}>@username</Text>
            </View>
            <View style={styles.usernameContainer}>
                <Text style={styles.balance}>Balance: 0.00 Eth</Text>
            </View>
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        alignItems: "center",
    },
    balance: {
        marginLeft: 10,
        marginTop: 10,
        fontSize: 15,
    },
    banner: {
        width: "100%",
        height: 200,
    },
    aviView: {
        position: "absolute",
        height: 200,
        justifyContent: "center",
        alignItems: "center",
    },
    avi: {
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
    },
    usernameContainer: {
        width: "100%",
        flexDirection: "row",
    },
    username: {
        marginLeft: 10,
        fontSize: 30,
    },
};

export default AccountScreen;
