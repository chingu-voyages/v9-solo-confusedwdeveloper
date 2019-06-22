// this is where I will create and manage  functions to deal with UI
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import moment from "moment";
import { getRecipes } from "./ui";

// function to setup update form
const setupUpdateForm = async (user, recipeId) => {
  const recipes = await getRecipes(user);
  const recipe = recipes.find(i => i.id === recipeId);
  if (!recipe) {
    location.assign("/recipes.html");
  }
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
    renderUpdate(user, recipeId);
  });
};

// function to set up update.js
const renderUpdate = (user, recipeId) => {
  const updateSpan = document.querySelector("#update-span");
  const titleEl = document.querySelector("#update-title");
  const bodyEl = document.querySelector("#update-body");
  getRecipes(user).then(recipes => {
    const recipe = recipes.find(i => i.id === recipeId);
    if (!recipe) {
      location.assign("/recipes.html");
    }
    updateSpan.textContent = `Last updated ${moment(
      recipe.updatedAt
    ).fromNow()}.`;

    // set up update form
    titleEl.value = recipe.title;
    bodyEl.value = recipe.body;
  });
};

export { renderUpdate, setupUpdateForm };
