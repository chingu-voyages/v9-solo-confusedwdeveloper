// This module will be used to create and control/store recipes array and associated functions
import "./scss/recipes.scss";
import uuidv4 from "uuid/v4";
import moment from "moment";
// import { getFilters } from "./filters";
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

// Function to create a new recipe
const createRecipe = () => {
  const id = uuidv4();
  const time = moment().valueOf();

  recipes.push({
    id,
    createdAt: time,
    updatedAt: time,
    title: "",
    body: "",
    ingredients: []
  });
  saveRecipes();
  return id;
};

// function to remove a recipe
const removeRecipe = id => {
  const index = recipes.findIndex(i => i.id === id);
  recipes.splice(index, 1);
  saveRecipes();
};

// Function to update Recipes
const updateRecipe = (id, { title, body }) => {
  // find the recipe
  const recipe = recipes.find(i => i.id === id);
  if (!recipe) {
    return;
  }

  if (typeof title === "string") {
    recipe.title = title;
    recipe.updatedAt = moment().valueOf();
  }
  if (typeof body === "string") {
    recipe.body = body;
    recipe.updatedAt = moment().valueOf();
  }

  saveRecipes();
};

// a function to sort recipes
const sortRecipes = ({ sortBy }) => {
  if (sortBy == "byCreated") {
    return recipes.sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return -1;
      } else if (b.createdAt > a.createdAt) {
        return 1;
      } else {
        return 0;
      }
    });
  } else if (sortBy === "byEdited") {
    return recipes.sort((a, b) => {
      if (a.updatedAt > b.updatedAt) {
        return -1;
      } else if (b.updatedAt > a.updatedAt) {
        return 1;
      } else {
        return 0;
      }
    });
  } else {
    return recipes;
  }
};

// calling loadrecipes to load the recipes and initiate the program
loadRecipes();

// setting up exports
export {
  getRecipes,
  loadRecipes,
  createRecipe,
  removeRecipe,
  updateRecipe,
  sortRecipes
};
