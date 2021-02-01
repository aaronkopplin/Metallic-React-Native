import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import FeedScreen from "./feed";
import AccountScreen from "./account";
import PayRequestScreen from "./pay_request";

function HomeScreen() {
    const Tab = createBottomTabNavigator();
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        if (route.name === "Feed") {
                            return (
                                <Ionicons
                                    name={"home"}
                                    size={size}
                                    color={color}
                                />
                            );
                        } else if (route.name === "Account") {
                            return (
                                <MaterialCommunityIcons
                                    name={"account"}
                                    size={size}
                                    color={color}
                                />
                            );
                        } else if (route.name === "PayRequest") {
                            return (
                                <MaterialCommunityIcons
                                    name={"ethereum"}
                                    size={size}
                                    color={color}
                                />
                            );
                        }
                    },
                })}
                tabBarOptions={{
                    activeTintColor: "green",
                    inactiveTintColor: "gray",
                }}
            >
                <Tab.Screen name="Feed" component={FeedScreen} />
                <Tab.Screen name="PayRequest" component={PayRequestScreen} />
                <Tab.Screen name="Account" component={AccountScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default HomeScreen;
