import { StyleSheet, Dimensions, Platform } from "react-native";

const screenSize =
    Platform.OS === "web" ? Dimensions.get("window") : Dimensions.get("screen");

export const masterStyles = StyleSheet.create({
  mainBackground: {
    flex: 1,
    backgroundColor: '#1e1c21',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  title: {
    color: '#79777d',
    fontWeight: 'bold',
    fontSize: 40,
  },
  logo: {
    height: Platform.OS == "web" ? 150 : 100,
    width: Platform.OS == "web" ? 150 : 100,
    alignSelf: "center",
    margin: 20,
    borderRadius: 50,
    resizeMode: "cover",
  },
  headings: {
    color: '#79777d',
    fontWeight: 'bold',
    fontSize: 25,
  },
  headingsSmall: {
    color: '#79777d',
    fontWeight: 'bold',
    fontSize: 20,
  },
  headingsSmallNotBold: {
    color: '#79777d',
    fontWeight: 'normal',
    fontSize: 20,
  },
  input: {
    fontSize: 15,
    height: 25,
    backgroundColor: '#fff', 
    borderRadius: 3,
    paddingLeft: 5,
  },
  filler: {
    flex: .025,
    backgroundColor: '#2e2b30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerView: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#fff",
  },
  footerLink: {
    color: "#788eec",
    fontWeight: "bold",
    fontSize: 16,
  },
  formContainer: {
    flexDirection: "row",
    height: 80,
    marginTop: 40,
    marginBottom: 20,
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  homeInput: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: "#788eec",
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  listContainer: {
    marginTop: 20,
    padding: 20,
  },
  entityContainer: {
    marginTop: 10,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingLeft: 0,
  },
  entityText: {
    fontSize: 25,
    paddingLeft: 10,
    color: "#ffffff",
    fontWeight: "normal",
  },

  // ****** Login Screen ******
  loginKeyboardAvoidView: {
    backgroundColor: "#2e2b30",
    width: 
      Platform.OS == "web" 
        ? screenSize.width *.6 
        : screenSize.width * .95,
    // height:
    //   Platform.OS === "web"
    //       ? screenSize.height * .5
    //       : screenSize.width * .9,
    paddingTop: screenSize.height / 50,
    paddingLeft: 20,
    borderRadius: 10,
  },
  mainHeadings: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: screenSize.height * 0.01,
    paddingBottom: screenSize.height * 0.005,
  },

  // ****** Registration Screen ******
  registrationKeyboardAwareView: {
    backgroundColor: "#2e2b30",
    width: 
      Platform.OS == "web" 
        ? screenSize.width *.6 
        : screenSize.width * .95,
    height:
        Platform.OS === "web"
            ? screenSize.height * .5
            : screenSize.width * 0.85,
    paddingTop: Platform.OS == "web" ? screenSize.height / 50 : screenSize.height * 0,
    paddingLeft: 20,
    borderRadius: 10,

  },

  // ****** Main Styles After Login ******
  mainView: {
    flex: 1, 
    backgroundColor: "#1e1c21", 
    alignContent: 'center', 
    alignItems: 'center',
  },

  // ****** Account Screens ******
  accountContainer: {
    backgroundColor: "#2e2b30",
    width: Platform.OS == "web" ? screenSize.width *.6 : screenSize.width * .99,
    height: Platform.OS == "web" ? screenSize.height * .9 : screenSize.height * .76 + 2,
    top: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  accountMyAccount: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 30,
    margin: 5,
  },
  accountUserName: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 5,
  },
  accountHeadings: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  accountDetails: {
    color: '#dbdbdb',
    fontWeight: 'normal',
    fontSize: 20,
  },

  // ****** Contacts Screen ******
  constactsUserContainer: {
    backgroundColor: "#ffffff", 
    borderRadius: 5, 
    maxWidth: screenSize.width * .6,
    maxHeight: screenSize.height * .07,
    overflow: "hidden",
    textAlign: "center",
    bottom: 
        Platform.OS == "web" 
        ? 0
        : screenSize.height * .01,
    justifyContent: 'center'
  },

  contactsUserTopName: {
    color: '#79777d',
    fontWeight: 'bold',
    fontSize: 35,
  },

  contactsUserLogo: {
    height: 50,
    width: 50,
    right: screenSize.width * 0.01,
    top: Platform.OS == 'web' ? 0 : screenSize.height * -.01
  },

  contactsContainer: {
    backgroundColor: "#2e2b30", 
    paddingBottom: 10, 
    borderRadius: 5, 
    height: Platform.OS == "web" ? (screenSize.height * 0.8) : screenSize.height,
    maxHeight: Platform.OS == "web" ? screenSize.height : Platform.OS == "android" ? (screenSize.height * 0.67) - 2 : (screenSize.height * 0.66) - 1, 
    width: Platform.OS == "web" ? screenSize.width *.6 : screenSize.width * .99
  },

  contactsNameContainer: { 
    paddingLeft: 5, 
    paddingVertical: 5,
    marginBottom: 3,
    borderRadius: 5,
    backgroundColor: '#ffffff', 
    width: Platform.OS == 'web' ? screenSize.width * 0.55 : screenSize.width * 0.8,
    left: Platform.OS == "web" ? screenSize.width * 0.02 : screenSize.width * 0.02,
  },

  contactsNamesText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 25,
    paddingLeft: 5, 
    paddingVertical: 5,
  },

  contactsTitleText: {
    color: '#9448CC',
    textDecorationLine: "underline",
    fontWeight: 'bold',
    fontSize: 22,
    left: Platform.OS == "web" ? 0 : 3,
    paddingLeft: Platform.OS == "web" ? screenSize.width * .01 : 0,
  },

  contactsLogo: {
    height: 40,
    width: 40,
    left: Platform.OS == "web" ? screenSize.width * .01 : 0,
    top: Platform.OS == 'web' ? screenSize.height * .0075 : screenSize.height * 0.005,
  },


  // ****** Payment Screen ******
  paymentFlatListContainer: {
    marginTop: 6,
    borderBottomWidth: 0,
    paddingVertical: 8,
    borderRadius: 10
  },


  // ****** Recent Chats Screen ******
  recentChatsLogo: {
    height: 50,
    width: 50,
    borderRadius: 50,
    resizeMode: "cover",
  },
  recentChat: {
    fontSize: 15,
    maxWidth: screenSize.width * .55,
    color: "#79777d",
    paddingLeft: 25,
    overflow: "hidden",
  },
  recentChatsContainer: {
    backgroundColor: "#2e2b30", 
    paddingBottom: 10, 
    borderRadius: 5, 
    height: Platform.OS == "web" ? (screenSize.height * 0.85) : Platform.OS == "android" ? (screenSize.height * 0.75) : (screenSize.height * 0.75 + 10),
    maxHeight: Platform.OS == "web" ? screenSize.height : Platform.OS == "android" ? (screenSize.height * 0.75) : (screenSize.height * 0.75 + 10), 
    width: Platform.OS == "web" ? screenSize.width *.6 : screenSize.width * .99,
    top: 10,
    
  },
  recentChatsUserNames: {
    fontSize: 30,
    paddingLeft: 10,
    color: "#ffffff",
    fontWeight: "normal",
  },

  // ****** User Search Screen ******
  userSearchPrompt: {
    top: -30
  },
  userSearchListContainer: {
    backgroundColor: "#2e2b30", 
    marginTop: 10, 
    borderRadius: 5, 
    paddingVertical: 10,
    height: Platform.OS == "web" ? (screenSize.height * 0.8) : screenSize.height,
    maxHeight: Platform.OS == "web" ? screenSize.height: (screenSize.height * 0.704) + 8.5, 
    width: Platform.OS == "web" ? screenSize.width *.6 : screenSize.width * .99,
  },
  userSearchLogo: {
    height: 50, 
    width: 50,
    resizeMode: "cover",
    borderRadius: 50,
  },
});
