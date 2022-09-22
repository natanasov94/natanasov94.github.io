var CATEGORY_SELECT = "#category_select";
var ADD_RECIPE_BUTTON = "#add_recipe_button";
var NEW_RECIPE_FIELD = "#new_recipe_field";
var RECIPE_CONTAINER = "#recipe_container";
var ADD_CATEGORY_BUTTON = "#add_category_button";
var RESET_BUTTON = "#reset_button";
var RANDOM_RECIPE_BUTTON = "#get_random_recipe_button";

var LOCAL_STORAGE_CATEGORY = "categories";
var LOCAL_STORAGE_RECIPES = "recipes";

var INITIAL_CATEGORIES = [
    'Snack',
    'Dinner',
    'Lunch',
    'Breakfast',
];

var COLORS = [
    "is-black",
    "is-dark",
    "is-primary",
    "is-link",
    "is-info",
    "is-success",
    "is-warning",
    "is-danger"
]

// MAIN
$(document).ready(function () {
    init()
    addInitialCategories()
    addRecipeButtonOnClick()
    addCategoryButtonOnClick()
    removeRecipeOnClick()
    removeCategoryOnClick()
    resetButtonOnClick()
    getRandomRecipeOnClick()
});

// CATEGORIES

function addInitialCategories() {
    var categories = getCategories();
    var recipes = getRecipes();
    categories.forEach(category => {
        addCategoryToDropdown(category);
        showCategory(category);
        recipes[category].forEach(recipe => {
            prependRecipeToArticle(
                findArticleWithSelectedCategory(category),
                recipe
            );
        });
    });
}

function addCategoryToDropdown(categoryName) {
    var option = new Option(categoryName, categoryName);
    $(CATEGORY_SELECT).append($(option));
}

function addCategoryButtonOnClick() {
    $(ADD_CATEGORY_BUTTON).click(function () {
        var newCategoryText = $(NEW_RECIPE_FIELD).val();

        var allCategories = getCategories()
        if (allCategories.indexOf(newCategoryText) > -1) {
            alert("Recipe already exists");
        } else {
            allCategories.push(newCategoryText);
            setCategories(allCategories);
            var recipes = getRecipes()
            recipes[newCategoryText] = [];
            setRecipes(recipes);
            addCategoryToDropdown(newCategoryText);
            showCategory(newCategoryText);
        }

    });
}

function showCategory(categoryName) {
    var category = `<div class="column is-narrow">
                        <article class="message ` + getRandomElementFromArray(COLORS) + `">
                            <div class="message-header">
                                <p>` + categoryName + `</p>
                                <button class="delete" aria-label="delete"></button>
                            </div>
                            <div class="message-body">
                            </div>
                        </article>
                    </div>`
    $(RECIPE_CONTAINER).prepend($(category))
}

function removeCategoryOnClick() {
    $(RECIPE_CONTAINER).on("click", ".delete", function () {
        var category = $(this).closest(".message-header").find("p").text();
        $(CATEGORY_SELECT + " option[value='" + category + "']").each(function () {
            $(this).remove();
        });
        $(this).closest(".column.is-narrow").remove();

        var allCategories = getCategories()
        allCategories.splice(allCategories.indexOf(category), 1);
        setCategories(allCategories);

        var recipes = getRecipes()
        delete recipes[category];
        setRecipes(recipes);
    });
}

function getSelectedCategory() {
    return $(CATEGORY_SELECT).find(":selected").text();
}

// RECIPES

function addRecipeButtonOnClick() {
    $(ADD_RECIPE_BUTTON).click(function () {
        addRecipe();
    });

}

function addRecipe(category, recipeText) {
    var newRecipeText = recipeText || $(NEW_RECIPE_FIELD).val();
    var selectedCategory = category || getSelectedCategory();
    var article = findArticleWithSelectedCategory(selectedCategory);
    var recipes = getRecipes();
    if (recipes[selectedCategory].length > 0 && recipes[selectedCategory].indexOf(newRecipeText) > -1) {
        alert("Recipe already exists");
    } else {
        recipes[selectedCategory].push(newRecipeText);
        setRecipes(recipes);
        prependRecipeToArticle(article, newRecipeText);
    }
}

function findArticleWithSelectedCategory(selectedCategory) {
    var articles = $(RECIPE_CONTAINER).find("article");
    for (let i = 0; i < articles.length; i++) {
        var article = articles[i];
        var category = $(article).find("p").text();
        if (category === selectedCategory) {
            return article;
        }
    }
}

function prependRecipeToArticle(article, recipeText) {
    var recipe = `<div class="board-item">
                    <div class="board-item-content"><span>` + recipeText + `</span></div>
                  </div>`
    $(article).find(".message-body").prepend($(recipe));
}

function removeRecipeOnClick() {
    $(RECIPE_CONTAINER).on("click", ".board-item", function () {
        var recipeText = $(this).find("span").text();
        var categoryText = $(this).closest(".column.is-narrow").find("p").text();
        var recipes = getRecipes();
        recipes[categoryText].splice(recipes[categoryText].indexOf(recipeText), 1);
        setRecipes(recipes);
        $(this).remove();
    });
}

function getRandomRecipeOnClick() {
    $(RANDOM_RECIPE_BUTTON).click(function () {
        var recipes = getRecipes()
        var categoryRecipes = recipes[getSelectedCategory()]
        if (categoryRecipes.length > 0) {
            var randomRecipe = getRandomElementFromArray(categoryRecipes);
            alert(randomRecipe);
        }
    });
}

// LocalStorage

function init() {
    if (getCategories() === null) {
        var recipes = {};
        setCategories(INITIAL_CATEGORIES);
        INITIAL_CATEGORIES.forEach(category => {
            recipes[category] = [];
        })
        setRecipes(recipes);
    }
}

function resetButtonOnClick() {
    $(RESET_BUTTON).click(function () {
        localStorage.clear();
        location.reload();
    });
}

function getCategories() {
    return getLocalStorageItem(LOCAL_STORAGE_CATEGORY);
}

function setCategories(categories) {
    setLocalStorageItem(LOCAL_STORAGE_CATEGORY, categories);
}

function getRecipes() {
    return getLocalStorageItem(LOCAL_STORAGE_RECIPES);
}

function setRecipes(recipes) {
    setLocalStorageItem(LOCAL_STORAGE_RECIPES, recipes);
}

function getLocalStorageItem(itemName) {
    return JSON.parse(localStorage.getItem(itemName));
}

function setLocalStorageItem(itemName, item) {
    localStorage.setItem(itemName, JSON.stringify(item));
}

// Utility

function getRandomElementFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}