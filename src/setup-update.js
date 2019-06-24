// this is where I will create and manage  functions to deal with UI
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import moment from "moment";
import { getRecipes } from "./ui";
import uuidv4 from "uuid/v4";

// function to setup update form
const setupUpdateForm = async (user, recipeId) => {
  const recipes = await getRecipes(user);
  const recipe = recipes.find(i => i.id === recipeId);
  // if (!recipe) {
  //   location.assign("/recipes.html");
  // }
  const updateForm = document.querySelector("#update-form");
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
    e.target.elements.title.value = "";
    e.target.elements.body.value = "";
    // renderUpdate(user, recipeId);
  });
};

// function to set up add ingredient form
const addIngredientForm = async (user, recipeId) => {
  const form = document.querySelector("#add-ingredient-form");

  // getting recipes
  const recipes = await getRecipes(user);
  const recipe = recipes.find(i => i.id === recipeId);
  // if (!recipe) {
  //   location.assign("/recipes.html");
  // }
  const ingredients = recipe.ingredients;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const text = e.target.elements.newIngredient.value.trim();
    const id = uuidv4();
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
      });
    form.reset();
  });
};

// function to remove one recipe
const removeRecipe = async (user, recipeId) => {
  // unsubscribe();
  const recipes = await getRecipes(user);
  const index = recipes.findIndex(i => i.id === recipeId);
  if (index > -1) {
    recipes.splice(index, 1);
    //saving to database
    firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .set({
        recipes: recipes
      })
      .then(() => {
        location.assign("/recipes.html");
      });
  }
};

// // wire up filters and remove button
// const wireupUpdateElements = (user, recipeId) => {
//   const removeButton = document.querySelector("#remove-recipe");

//   const checkboxFilter = document.querySelector("#hide-completed");
// };

export { setupUpdateForm, addIngredientForm, removeRecipe };
