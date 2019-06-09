// this module will handle four filters for recipes and ingredients
const filters = {
  recipesSearchText: "",
  sortBy: "byEdited",
  ingredientsSearchText: "",
  hideCompleted: false
};

// expose filters to other modules
const getFilters = () => filters;

// function to change filter values
const setFilters = ({
  recipesSearchText,
  sortBy,
  ingredientsSearchText,
  hideCompleted
}) => {
  if (typeof recipesSearchText === "string") {
    filters.recipesSearchText = recipesSearchText;
  }
  if (typeof sortBy === "string") {
    filters.sortBy = sortBy;
  }
  if (typeof hideCompleted === "boolean") {
    filters.hideCompleted = hideCompleted;
  }
  if (typeof ingredientsSearchText === "string") {
    filters.ingredientsSearchText = ingredientsSearchText;
  }
};

export { getFilters, setFilters };
