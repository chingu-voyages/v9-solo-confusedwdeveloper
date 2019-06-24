// this is where I will create and manage  functions to deal with UI
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import { getRecipes } from "./ui";

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

export { removeRecipe };
