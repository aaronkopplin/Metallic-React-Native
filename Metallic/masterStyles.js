import { StyleSheet, Dimensions, Platform } from 'react-native';

const screenSize = Platform.OS === "web" ? Dimensions.get("window") : Dimensions.get("screen");

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
    height: 150,
    width: 150,
    alignSelf: "center",
    margin: 30,
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
    fontSize: 18,
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
    marginTop: 16,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  entityText: {
    fontSize: 20,
    color: "#333333",
  },
  contactBar: { 
    paddingLeft: 10, 
    paddingVertical: 5,
    marginBottom: 3,
    borderRadius: 90,
    backgroundColor: '#fff', 
    width: Platform.OS == "web" ? screenSize.width * 0.95 : screenSize.width * 0.8,
    left: Platform.OS == "web" ? screenSize.width * 0.05 : screenSize.width * 0.1,
  },
  contactNames: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 25,
  },
  contactTitle: {
    color: '#6706AD',
    textDecorationLine: "underline",
    fontWeight: 'bold',
    fontSize: 40,
  }
});