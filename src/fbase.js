import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAdyuCpQXNUY1_DWMJF7YlZINrKVNXEx_o",
    authDomain: "doddle-edge.firebaseapp.com",
    databaseURL: "https://doddle-edge.firebaseio.com",
    projectId: "doddle-edge",
    storageBucket: "doddle-edge.appspot.com",
    messagingSenderId: "479833056969",
    appId: "1:479833056969:web:dd93af468094d32e744f18",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const dbService = firebase.firestore();
export const authService = firebase.auth();
export const fbaseInstance = firebase;
