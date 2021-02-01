import * as React from "react";
import { Button, Text, View, StatusBar } from "react-native";
import { ListItem, Avatar } from "react-native-elements";

const list = [
    {
        name: "Amy Farha",
        avatar_url: "../assets/avi.jpeg",
        subtitle: "Vice President",
    },
    {
        name: "Chris Jackson",
        avatar_url:
            "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
        subtitle: "Vice Chairman",
    },
];

function PayRequestScreen() {
    return (
        <View style={styles.container}>
            <View height={StatusBar.currentHeight} />
            <View>
                {list.map((l, i) => (
                    <ListItem key={i} bottomDivider>
                        <Avatar source={{ uri: l.avatar_url }} />
                        <ListItem.Content>
                            <ListItem.Title>{l.name}</ListItem.Title>
                            <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </View>
        </View>
    );
}

const styles = {
    container: {},
};

export default PayRequestScreen;
