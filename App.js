import * as React from "react";
import { Button, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import "./global";

import HomeScreen from "./screens/home";

const App = () => {
    const Web3 = require("web3");
    const web3 = new Web3(
        new Web3.providers.HttpProvider("https://mainnet.infura.io/")
    );
    web3.eth.getBlock("latest").then(console.log);

    return <HomeScreen />;
};

export default App;
