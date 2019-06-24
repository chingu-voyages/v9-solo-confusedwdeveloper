import moment from "moment";
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import { getFilters } from "./filters";

// function to remove ingredient
const removeIngredient = (recipes, recipeId, ingredientId, user) => {
  const recipe = recipes.find(i => i.id === recipeId);
  const ingredients = recipe.ingredients;
  const index = ingredients.findIndex(i => i.id === ingredientId);
  if (ingredientId > -1) {
    ingredients.splice(index, -1);
    recipe.updatedAt = moment().valueOf();
    firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .set({
        recipes: recipes
      })
      .then(() => {});
  }
};

// function to toggle ingredient
const toggleIngredient = (recipes, recipeId, ingredientId, user) => {
  const recipe = recipes.find(i => i.id === recipeId);
  const ingredients = recipe.ingredients;
  const ingredient = ingredients.find(i => i.id === ingredientId);
  if (ingredient) {
    ingredient.completed = !ingredient.completed;
    recipe.updatedAt = moment().valueOf();
    firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .set({
        recipes: recipes
      })
      .then(() => {});
  }
};

// function to generate individual ingredient list/card
const generateIngredientLIst = (recipes, ingredient, recipeId, user) => {
  // root div
  const rootDiv = document.createElement("div");

  // add classes to root div
  rootDiv.classList.add(
    "ingredient-card",
    "d-flex",
    "justify-content-between",
    "align-items-center"
  );

  // work on form check elements
  const formDiv = document.createElement("div");
  formDiv.classList.add("form-check");

  const checkboxEl = document.createElement("input");
  checkboxEl.setAttribute("type", "checkbox");
  // setting checked value
  checkboxEl.checked = ingredient.completed;
  checkboxEl.setAttribute("id", ingredient.id);
  checkboxEl.classList.add("form-check-input");

  // label
  const labelEl = document.createElement("label");
  labelEl.setAttribute("for", ingredient.id);
  labelEl.classList.add("form-check-label");
  labelEl.textContent = ingredient.text;

  formDiv.appendChild(checkboxEl);
  formDiv.appendChild(labelEl);

  // button
  const buttonEl = document.createElement("button");
  buttonEl.textContent = "Remove";
  buttonEl.classList.add("btn", "btn-link");

  //append
  rootDiv.appendChild(formDiv);
  rootDiv.appendChild(buttonEl);

  // event listeners
  buttonEl.addEventListener("click", e => {
    removeIngredient(recipes, recipeId, ingredient.id, user);
  });

  checkboxEl.addEventListener("change", e => {
    toggleIngredient(recipes, recipeId, ingredient.id, user);
  });
  return rootDiv;
};

// function to set up update.js
const renderUpdate = (recipes, recipeId, user) => {
  const updateSpan = document.querySelector("#update-span");
  const titleEl = document.querySelector("#update-title");
  const bodyEl = document.querySelector("#update-body");

  // find recipe by id
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

  // render ingredients list

  // filters
  const { ingredientsSearchText, hideCompleted } = getFilters();
  // ingredients
  let ingredients = recipe.ingredients;
  // select container
  const containerDiv = document.querySelector(".ingredient-card-list");

  // use filters
  ingredients = ingredients.filter(
    i =>
      i.text
        .trim()
        .toLowerCase()
        .includes(ingredientsSearchText.toLowerCase()) &&
      (!hideCompleted || !i.completed)
  );

  // clear inner HTML of container before rendering
  containerDiv.innerHTML = "";
  //render
  if (ingredients.length > 0) {
    ingredients.forEach(i => {
      const card = generateIngredientLIst(recipes, i, recipeId, user);
      containerDiv.appendChild(card);
    });
  } else {
    const emptyMsg = document.createElement("h4");
    emptyMsg.textContent = "Nothing to show here.";
    emptyMsg.classList.add("text-center");
    containerDiv.appendChild(emptyMsg);
  }
};

export { renderUpdate };
