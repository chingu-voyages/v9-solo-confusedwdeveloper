// this is where I will create and manage  functions to deal with UI
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import uuidv4 from "uuid/v4";
import moment from "moment";

// set up modal Body
const setUpModalBody = user => {
  const div = document.createElement("div");
  const para1 = document.createElement("p");
  const para2 = document.createElement("p");
  para1.textContent = `Name:  ${user.displayName}`;
  if (user.email) {
    para2.textContent = `Email:  ${user.email}`;
  }
  div.appendChild(para1);
  div.appendChild(para2);
  return div;
};
// function to create a new recipe
const getRecipes = async user => {
  let recipes;
  const doc = await firebase
    .firestore()
    .collection("users")
    .doc(user.uid)
    .get();

  if (doc.exists) {
    recipes = doc.data().recipes;
  } else {
    recipes = [];
  }

  return recipes;
};

// function to set up navbar
const setUpNavbar = user => {
  const logout = document.querySelector("#logout");
  const modalBody = document.querySelector(".modal-body");

  logout.addEventListener("click", e => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
      })
      .catch(function(error) {
        // An error happened.
      });
  });
  modalBody.appendChild(setUpModalBody(user));
};

const setupCreateRecipeButton = user => {
  // set up create recipe button
  const createRecipeButton = document.querySelector("#go-to-update");
  createRecipeButton.addEventListener("click", e => {
    const id = uuidv4();
    const time = moment().valueOf();
    getRecipes(user)
      .then(recipes => {
        recipes.push({
          id,
          createdAt: time,
          updatedAt: time,
          title: "",
          body: "",
          ingredients: []
        });
        return firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .set({
            recipes: recipes
          });
      })
      .then(() => {
        location.assign(`/update.html#${id}`);
      });
  });
};

export { setUpNavbar, getRecipes, setupCreateRecipeButton };
