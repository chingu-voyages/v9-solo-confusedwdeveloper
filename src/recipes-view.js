// module to contain function to render recipes
import { getFilters } from "./filters";

// function to generate individual cards
const generateRecipeCard = recipe => {
  const id = recipe.id;

  const rootDiv = document.createElement("div");
  rootDiv.classList.add("col-md-6", "mb-4");

  // anchor tab set up
  const anchorEl = document.createElement("a");
  anchorEl.setAttribute("href", `/update.html#${id}`);
  anchorEl.style.cssText = "text-decoration: none; color: #212529;";

  // card
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");
  // header
  const cardHeaderEl = document.createElement("div");
  cardHeaderEl.classList.add("card-header");
  const titleEl = document.createElement("h3");
  titleEl.textContent = recipe.title;
  cardHeaderEl.appendChild(titleEl);
  cardDiv.appendChild(cardHeaderEl);

  // card body
  const cardBodyEl = document.createElement("div");
  cardBodyEl.classList.add("card-body");
  const paraEl = document.createElement("p");
  paraEl.classList.add("card-text");
  paraEl.textContent = recipe.body;
  cardBodyEl.appendChild(paraEl);
  cardDiv.appendChild(cardBodyEl);

  // footer
  const footerDiv = document.createElement("div");
  footerDiv.textContent = ingredientMessage(recipe);
  footerDiv.classList.add("card-footer");
  cardDiv.appendChild(footerDiv);

  anchorEl.appendChild(cardDiv);
  rootDiv.appendChild(anchorEl);
  return rootDiv;
};

// function to generate ingredient message
const ingredientMessage = recipe => {
  const newArr = [...recipe.ingredients];
  const arr = newArr.filter(i => i.completed);
  const length = arr.length;
  let value;
  if (newArr.length === 0) {
    return "You have not added any ingredients.";
  } else if (length === newArr.length && length !== 0) {
    value = "all";
  } else if (length === 0) {
    value = "none";
  } else if (length === 1) {
    value = "one";
  } else {
    value = "some";
  }
  return `You have ${value} of the ingredients.`;
};

// function to sort recipes
const sortRecipes = recipes => {
  const { sortBy } = getFilters();
  if (sortBy === "byEdited") {
    return recipes.sort((a, b) => {
      if (a.updatedAt > b.updatedAt) {
        return -1;
      } else if (b.updatedAt > a.updatedAt) {
        return 1;
      } else {
        return 0;
      }
    });
  } else if (sortBy === "byCreated") {
    return recipes.sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return -1;
      } else if (b.createdAt > a.createdAt) {
        return 1;
      } else {
        return 0;
      }
    });
  } else {
    return recipes;
  }
};

const renderRecipes = recipes => {
  const { recipesSearchText } = getFilters();

  // root
  const rootEl = document.querySelector("#root-app");
  recipes = sortRecipes(recipes);
  recipes = recipes.filter(i =>
    i.title.toLowerCase().includes(recipesSearchText.toLowerCase().trim())
  );

  // now clear innerHTML before renering
  rootEl.innerHTML = "";
  if (recipes.length > 0) {
    recipes.forEach(recipe => {
      rootEl.classList.add("row");
      const divEl = generateRecipeCard(recipe);
      rootEl.appendChild(divEl);
    });
  } else {
    const notificationEl = document.createElement("h3");
    notificationEl.textContent = "You have no recipes.";
    rootEl.classList.remove("row");
    notificationEl.classList.add("text-center", "text-white");
    rootEl.appendChild(notificationEl);
  }
};

export { renderRecipes };
