// Check if favouritesList exists in local storage, if not, create an empty array
if (localStorage.getItem("favouritesList") == null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}

//  Fetches meals from the API and returns them
async function fetchMealsFromApi(url,value) {
    const response=await fetch(`${url+value}`);
    const meals=await response.json();
    return meals;
}



// show's all meals items acording to search input value
function showMealList(){
    let inputValue = document.getElementById("my-search").value;
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    let url="https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let html = "";
    let meals=fetchMealsFromApi(url,inputValue);
    meals.then(data=>{
        if (data.meals) {
            data.meals.forEach((element) => {
                let isFav=false;
                for (let index = 0; index < arr.length; index++) {
                    if(arr[index]==element.idMeal){
                        isFav=true;
                    }
                }
                if (isFav) {
                    html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                            <button id="main${element.idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
                } else {
                    html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                            <button id="main${element.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
                }  
            });
        } else {
            html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-4 lead">
                                The meal you are looking for was not found.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
        document.getElementById("main").innerHTML = html;
    });
}



// Display the full meal details in the main section
async function showMealDetails(id) {
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let response = await fetch(`${url}${id}`);
  let data = await response.json();
  let meal = data.meals[0];

  let html = `
    <div id="card" class="card mb-5" style="width: 50rem; display: flex; flex-direction: column;">
        <div class="row">
            <div class="col-md-6">
                <img src="${meal.strMealThumb}" class="card-img-top" style="width: 100%;" alt="Loading....">
            </div>
            <div class="col-md-6 d-flex align-items-end">
                <div class="card-body text-center mt-auto">
                    <h3 class="card-title text-muted"><strong>${meal.strMeal}</strong></h3>
                    <br>
                    <h6 class="card-subtitle mb-3 text-block"><strong>Category: </strong>${meal.strCategory}</h6>
                    <h6 class="card-text"><strong>Area: </strong>${meal.strArea}</h6>
                </div>
            </div>
        </div>

        <div class="card-body d-flex flex-column justify-content-end">
            <h5 class="card-subtitle mb-3 text-muted">Instructions:</h5>
            <p class="card-text">${meal.strInstructions}</p>
            <h5 class="card-subtitle mb-4 text-muted">Ingredients:</h5>
            <ul class="list-group list-group-flush">
                ${generateIngredientsList(meal)}
            </ul>
        </div>
        <div class="text-center">
            <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
        </div>
    </div>
  `;

  document.getElementById("main").innerHTML = html;
}


// Generate HTML for the ingredients list
function generateIngredientsList(meal) {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient) {
        ingredientsList += `<li>${ingredient} - ${measure}</li>`;
      }
    }
    return ingredientsList;
  }


//shows all favourites meals in favourites body
async function showFavMealList() {
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html="";
    if (arr.length==0) {
        html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-4 lead">
                                No meal added in your favourites list.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
    } else {
        for (let index = 0; index < arr.length; index++) {
            await fetchMealsFromApi(url,arr[index]).then(data=>{
                html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${data.meals[0].strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                            <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
            });   
        }
    }
    document.getElementById("favourites-body").innerHTML=html;
}


//Adds and Remove meals to favourites list
function addRemoveToFavList(id) {
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    let contain=false;
    for (let index = 0; index < arr.length; index++) {
        if (id==arr[index]) {
            contain=true;
        }
    }
    if (contain) {
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        alert("your meal removed from your favourites list");
    } else {
        arr.push(id);
        alert("your meal add your favourites list");
    }
    localStorage.setItem("favouritesList",JSON.stringify(arr));
    showMealList();
    showFavMealList();
}
// Fetch and display a random meal
async function fetchRandomMeal() {
  let url = "https://www.themealdb.com/api/json/v1/1/random.php";
  let response = await fetch(url);
  let data = await response.json();
  let meal = data.meals[0];

  let html = `
  <div id="card" class="card mb-5" style="width: 50rem; display: flex; flex-direction: column;">
      <div class="row">
          <div class="col-md-6">
              <img src="${meal.strMealThumb}" class="card-img-top" style="width: 100%;" alt="Loading....">
          </div>
          <div class="col-md-6 d-flex align-items-end">
              <div class="card-body text-center mt-auto">
                  <h3 class="card-title text-muted"><strong>${meal.strMeal}</strong></h3>
                  <br>
                  <h6 class="card-subtitle mb-3 text-block"><strong>Category: </strong>${meal.strCategory}</h6>
                  <h6 class="card-text"><strong>Area: </strong>${meal.strArea}</h6>
              </div>
          </div>
      </div>

      <div class="card-body d-flex flex-column justify-content-end">
          <h5 class="card-subtitle mb-3 text-muted">Instructions:</h5>
          <p class="card-text">${meal.strInstructions}</p>
          <h5 class="card-subtitle mb-4 text-muted">Ingredients:</h5>
          <ul class="list-group list-group-flush">
              ${generateIngredientsList(meal)}
          </ul>
      </div>
      <div class="text-center">
          <a href="${meal.strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
      </div>
  </div>
  `;

  document.getElementById("main").innerHTML = html;
}

// Add event listeners to buttons and form submission
document.getElementById("search-form").addEventListener("submit", function (event) {
  event.preventDefault();
  showMealList();
});

document.getElementById("favourites-btn").addEventListener("click", function () {
  showFavMealList();
});

document.getElementById("random-btn").addEventListener("click", function () {
  fetchRandomMeal();
});

// Initial display
showMealList();




// // Fetch a random meal from the API
// async function getRandomMeal() {
//     const url = "https://www.themealdb.com/api/json/v1/1/random.php";
//     const response = await fetch(url);
//     const data = await response.json();
//     return data.meals[0];
//   }

// // Function to display a random meal
// async function showRandomMeal() {
//   const randomMeal = await getRandomMeal();
//   // Display the random meal details or do whatever you want with it
//   console.log(randomMeal);
// }