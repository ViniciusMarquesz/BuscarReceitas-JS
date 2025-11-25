/*
  Lógica de Programação

  [x] Pegar a informação do Input, quando o botão for clicado
  [x] Ir até a API, e trazer as receitas
  [x] Colocar as receitas na tela
  [x] Saber quando usuario clicou na receita
  [x] Buscar informações da receita individual na API
  [x] Colocar a receita individual na tela

 */

const input = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const recipeList = document.querySelector(".recipe-list");
const recipeDetails = document.querySelector(".recipe-details");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const inputValue = event.target[0].value;
  searchRecipes(inputValue);
});

async function searchRecipes(ingredient) {
  recipeList.innerHTML = `<p>Uploading recipes
...</p>`;

  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );

  const data = await response.json();
  if (!data.meals) {
    recipeList.innerHTML = "<p>No recipes found...</p>";
    return; // Sai da função e não tenta mostrar receitas
  }

  showRecipes(data.meals);
}

function showRecipes(recipes) {
  recipeList.innerHTML = recipes
    .map(
      (item) => `
      
      <div class="recipe-card" onclick="getRecipesDetails(${item.idMeal})">
        <img src="${item.strMealThumb}" alt="receita-foto">
        <h3>${item.strMeal}</h3>

      </div>
      
      `
    )
    .join("");
}

async function getRecipesDetails(id) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );

  let ingredients = "";
  const data = await response.json();
  const recipe = data.meals[0];
  console.log(recipe);

  for (let i = 1; i <= 20; i++) {
    if (recipe[`strIngredient${i}`]) {
      ingredients += `<li>${recipe[`strIngredient${i}`]} - ${
        recipe[`strMeasure${i}`]
      } </li>`;
    } else {
      break;
    }
  } //Pegar as instrucoes/ingredientes

  recipeDetails.innerHTML = `
    
    <h2>${recipe.strMeal}</h2>
    <img src="${recipe.strMealThumb}" alt=${recipe.strMeal} class="recipe-img">
    <h3>Category: ${recipe.strCategory}</h3>
    <h3>Origin: ${recipe.strArea}</h3>
    <ul>${ingredients}</ul>
    <h3>${recipe.strInstructions}</h3>
    <p>Tags: ${recipe.strTags}</p>
    <p>Video: <a href="${recipe.strYoutube}" target="_blank "> Assista no Youtube</a></p>
    
    `;
  recipeDetails.scrollIntoView({ behavior: "smooth" });
}
