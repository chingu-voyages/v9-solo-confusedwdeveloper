import "./scss/update.scss";
import "./scss/recipes.scss";
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
import { setUpNavbar } from "./ui";
import { removeRecipe } from "./setup-update";
import { renderUpdate } from "./update-view";
import { setFilters } from "./filters";
import moment from "moment";
import uuidv4 from "uuid/v4";
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
const form = document.querySelector("#add-ingredient-form");
const updateForm = document.querySelector("#update-form");

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
        const recipe = recipes.find(i => i.id === recipeId);
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

        updateForm.addEventListener("submit", e => {
          e.preventDefault();
          const title = e.target.elements.title.value.trim();
          const body = e.target.elements.body.value.trim();
          recipe.title = title;
          recipe.body = body;
          recipe.updatedAt = moment().valueOf();
          firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .set({
              recipes: recipes
            });
        });
        form.addEventListener("submit", e => {
          e.preventDefault();
          const ingredients = recipe.ingredients;
          const text = e.target.elements.newIngredient.value.trim();
          const id = uuidv4();
          if (text) {
            const ingredient = {
              id,
              text,
              completed: false
            };
            //adding to array
            ingredients.push(ingredient);

            // updating timestamp
            recipe.updatedAt = moment().valueOf();

            //saving to database
            firebase
              .firestore()
              .collection("users")
              .doc(user.uid)
              .set({
                recipes: recipes
              })
              .then(() => {
                form.reset();
              });
          }
        });
      });

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
