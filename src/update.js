import "./scss/update.scss";
import "./scss/recipes.scss";
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
import { setUpNavbar } from "./ui";
import {
  setupUpdateForm,
  addIngredientForm,
  removeRecipe
} from "./setup-update";
import { renderUpdate } from "./update-view";
import { setFilters } from "./filters";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./config";
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// selecting DOM elements
const textFilterIngredients = document.querySelector(
  "#text-filter-ingredients"
);
const checkboxFilter = document.querySelector("#hide-completed");

const recipeId = location.hash.substring(1);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    setUpNavbar(user);

    // wiring up event Listeners
    // wireupUpdateElements(user, recipeId);

    // setting up realtime update

    let unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .onSnapshot(doc => {
        const recipes = doc.data().recipes;
        renderUpdate(recipes, recipeId, user);

        // event listener on ingredient search filter

        textFilterIngredients.addEventListener("input", e => {
          setFilters({
            ingredientsSearchText: e.target.value.trim()
          });
          renderUpdate(recipes, recipeId, user);
        });

        // hide completed checkbox

        checkboxFilter.addEventListener("change", e => {
          setFilters({
            hideCompleted: e.target.checked
          });
          renderUpdate(recipes, recipeId, user);
        });
      });

    setupUpdateForm(user, recipeId);
    addIngredientForm(user, recipeId);

    const removeButton = document.querySelector("#remove-recipe");
    // setting up event listener on remove Button
    removeButton.addEventListener("click", e => {
      unsubscribe();
      removeRecipe(user, recipeId);
    });
  } else {
    location.assign("/index.html");
  }
});
