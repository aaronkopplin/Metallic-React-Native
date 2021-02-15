import * as firebase from "firebase";
import "@firebase/auth";
import "@firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyBGdRMdssrrDSYgtsVepwMClTqsUmhskuY",
    authDomain: "metallic-975be.firebaseapp.com",
    projectId: "metallic-975be",
    storageBucket: "metallic-975be.appspot.com",
    messagingSenderId: "296499327252",
    appId: "1:296499327252:web:103163f63ec7c202be1201",
    measurementId: "G-Z6V4MPVBXR",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };
