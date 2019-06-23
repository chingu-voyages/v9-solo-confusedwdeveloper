import moment from "moment";

// function to set up update.js
const renderUpdate = (recipes, recipeId) => {
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
};

export { renderUpdate };
