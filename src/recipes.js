import "./scss/recipes.scss";
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
import { setUpNavbar, setupCreateRecipeButton } from "./ui";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./config";
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    setUpNavbar(user);
    setupCreateRecipeButton(user);
    console.log(user);
  } else {
    location.assign("/index.html");
  }
});
