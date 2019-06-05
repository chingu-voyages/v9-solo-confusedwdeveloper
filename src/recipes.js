// This module will be used to create and control/store recipes array and associated functions
import "./scss/recipes.scss";

// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
import firebaseConfig from "./config";
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Now create empty recipes array
let recipes = [];

// saving reference to firestore
const db = firebase.firestore();

// expose recipes to other modules
const getRecipes = () => recipes;

// function to load receipes from firestore for a particular user
const loadRecipes = () => {
  // getting the current signed in user
  const user = firebase.auth().currentUser;

  // getting data from firestore
  const docRef = db.collection("users").doc(user.uid);

  docRef
    .get()
    .then(function(doc) {
      if (doc.exists) {
        // going to stringify and parse my array to prevent any error of mistaking object for maps
        recipes = JSON.parse(doc.data());
      } else {
        // probably better to do nothing
        recipes = [];
      }
    })
    .catch(function(error) {
      //   Placeholder. Will Output something to the DOM
    });
};

// Function to save recipes for each user
const saveRecipes = () => {
  // getting the current signed in user. I don't want to make it global variable
  const user = firebase.auth().currentUser;

  const x = JSON.stringify(recipes);
  // Add a new document in collection "cities"
  db.collection("users")
    .doc(user.uid)
    .set({
      recipes: x
    })
    .then(function() {
      console.log("Document successfully written!");
      // will update DOM LATER maybe call render function
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
      // maybe I will update DOM with error message
    });
};
