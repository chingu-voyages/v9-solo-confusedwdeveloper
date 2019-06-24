import "./scss/recipes.scss";
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
import { setUpNavbar, setupCreateRecipeButton } from "./ui";
import { renderRecipes } from "./recipes-view";
import { setFilters } from "./filters";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./config";
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//DOM selection
const textFilter = document.querySelector("#text-filter");
const dropDown = document.querySelector("#dropdown-filter");

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    setUpNavbar(user);
    setupCreateRecipeButton(user);

    //setting up real time update
    let unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .onSnapshot(doc => {
        const recipes = doc.data().recipes;
        renderRecipes(recipes);

        //setting up some event Listeners

        // text
        textFilter.addEventListener("input", e => {
          setFilters({
            recipesSearchText: e.target.value.trim()
          });
          renderRecipes(recipes);
        });

        // dropdown
        dropDown.addEventListener("change", e => {
          setFilters({
            sortBy: e.target.value
          });
          renderRecipes(recipes);
        });
      });
  } else {
    location.assign("/index.html");
  }
});
