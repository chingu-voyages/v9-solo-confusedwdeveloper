// module to contain function to render recipes
import { getFilters } from "./filters";

// function to generate ingredient message
const ingredientMessage = recipe => {
  const newArr = [...recipe.ingredients];
  const arr = newArr.filter(i => !i.completed);
  const length = arr.length;
  let value;
  if (length === newArr.length) {
    value = "none";
  } else if (length === 1) {
    value = "one";
  } else if (length === 0) {
    value = "all";
  } else {
    value = "some";
  }
  return `You have ${value} of the ingredients.`;
};

const renderRecipes = recipes => {};

export { renderRecipes };
