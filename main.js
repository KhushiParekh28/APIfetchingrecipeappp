const searchBox = document.querySelector(".searchBox");
const button = document.querySelector(".Search");
const recipeContainer = document.querySelector(".recipecontainer");
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

const fetchRecipes = async (query) => {
    try {
        recipeContainer.innerHTML = "Fetching recipes";
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();
        recipeContainer.innerHTML = "";
        if (data.meals) {
            data.meals.forEach(meal => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');
                recipeDiv.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                    <p><span>${meal.strArea}</span> Dish </p>
                    <p>Belongs to <span>${meal.strCategory}</span> Category </p>
                `;
                const button = document.createElement('button');
                button.textContent = "View Recipe";
                recipeDiv.appendChild(button);

                button.addEventListener('click', () => {
                    openRecipePopup(meal);
                });

                recipeContainer.appendChild(recipeDiv);
            });
        } else {
            recipeContainer.innerHTML = "No recipes found.";
        }
    } catch (error) {
        console.error("Error fetching recipes:", error);
        recipeContainer.innerHTML = "Error fetching recipes. Please try again.";
    }
};

const fetchIngredients = (meal) => {
    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
        }
    }
    return ingredients;
};

const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipename">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingreientlast">${fetchIngredients(meal)}</ul>
        <div>
            <h3>Instructions:</h3>
            <p class="recipeinstruction">${meal.strInstructions}</p>
        </div>
    `;
    recipeDetailsContent.parentElement.style.display = "block";
};

recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display = "none";
});

button.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (searchInput) {
        recipeContainer.innerHTML = ''; // Clear previous results
        fetchRecipes(searchInput);
    }
});
