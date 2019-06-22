import "./scss/update.scss";
import "./scss/recipes.scss";
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
import { setUpNavbar } from "./ui";
import { renderUpdate, setupUpdateForm } from "./setup-update";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./config";
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const recipeId = location.hash.substring(1);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    setUpNavbar(user);
    renderUpdate(user, recipeId);
    setupUpdateForm(user, recipeId);
    console.log(user);
    console.log(recipeId);
  } else {
    location.assign("/index.html");
  }
});
