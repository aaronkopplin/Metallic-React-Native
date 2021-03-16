import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
  Platform,
  SnapshotViewIOS,
  FlatList,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import styles from "./styles";
import { firebase } from "../../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import CustomButton from "../../../button";
import { SafeAreaView } from "react-native-safe-area-context";
import { masterStyles } from "../../../masterStyles";

export function UserSearchScreen(props) {


  const screenSize = Platform.OS === "web" ? Dimensions.get("window") : Dimensions.get("screen");

  const [searchText, setSearchText] = useState("");


  var [users, setUsers] = useState([]);
  const userRef = firebase.firestore().collection("users");

  useEffect(() => {
    userRef

      .onSnapshot(
        (querySnapshot) => {
          var newEntities = [];
          if (searchText.trim != "") {
            querySnapshot.forEach(doc => {
              const entity = doc.data();

              entity.id = doc.id;
              entity.email = doc.data().email;
              entity.fullName = doc.data().fullName;
              entity.userName = doc.data().userName;

              // get text prior to @ of email
              var emailToSearch = String(entity.email).substring(0, (String(entity.email).lastIndexOf('@'))).toLowerCase();
              const search = searchText.toLowerCase();
              if (emailToSearch.includes(search) || String(entity.fullName).toLowerCase().includes(search) || String(entity.userName).toLowerCase().includes(search)) {
                newEntities.push(entity);
              }

            });
            setUsers(newEntities);
          } else {
            querySnapshot.forEach(doc => {
              const entity = doc.data();

              entity.id = doc.id;
              entity.fullName = doc.data().fullName;
              entity.userName = doc.data().userName;

              newEntities.push(entity);
            });
            setUsers(newEntities);
          }


        },
        (error) => {
          console.log(error);
        }
      );
  });

  const navigation = useNavigation();
  const renderUser = ({ item, index }) => {
    return (
      <View style={[masterStyles.entityContainer, { paddingBottom: 20 }]}>
        <TouchableOpacity onPress={() => {
          navigation.navigate('UserAccountScreen', {
            email: item.email,
            fullName: item.fullName,
            userName: item.userName,
            uid: item.uid
          });
        }}>
          <View>
            <Text>
              <View style={{ justifyContent: "center", flex: 1 }}>
                <Image style={{ height: 35, width: 20 }} source={require("../../../assets/Default_Img.png")}></Image>
              </View>
              <View style={{ justifyContent: "center", flex: 1 }}>
                <Text style={[masterStyles.headingsSmall]} >{'\t'}{item.email}</Text>
                <Text style={[masterStyles.headingsSmallNotBold]} >{'\t'}{item.userName}</Text>
              </View>
            </Text>
          </View>
        </TouchableOpacity>

      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1e1c21", alignContent: 'center', justifyContent: 'space-evenly', alignItems: 'center' }}>
      <View style={{ backgroundColor: "#2e2b30", alignItems: 'center', paddingBottom: 40, borderRadius: 4, height: screenSize.height * 0.75, width: screenSize.width - 20 }}>
        <View style={{ backgroundColor: '#2e2b30', alignItems: 'center', top: 20, height: screenSize.height * 0.01, paddingBottom: 20 }} />
        <View style={{ width: screenSize.width - 40 }}>
          <TextInput
            style={[masterStyles.input]}
            placeholder="Enter name/username to search for a user"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setSearchText(text)}
            clearButtonMode="while-editing"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
        <View style={{ paddingVertical: 20, height: (screenSize.height * 0.75) - 40, width: screenSize.width - 20, paddingHorizontal: 10 }}>
          <FlatList
            data={users}
            renderItem={renderUser}
            keyExtractor={(item) => item.id}
            removeClippedSubviews={true}
          // style={{height: screenSize.height * 0.6}}
          />

        </View>

        {/* <View style={
                    masterStyles.mainBackground,
                    {flex: 1}
                }/> */}

      </View>
    </SafeAreaView>
  );
}