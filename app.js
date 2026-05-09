const movieContainer = document.getElementById("movies-container")

const searchBtn = document.getElementById("search-btn")
const searchInput = document.getElementById("search-input")

let movieTitle

// Geting data from the API
async function getData(){
    const res = await fetch(`https://www.omdbapi.com/?s=${movieTitle}&apikey=b2ab14a8`)
    const data = await res.json()

    if (data.Response === "True"){
        searchInput.placeholder = "Search for a movie"
        const movies = data.Search.slice(0, 3)
        renderData(movies)
    }
    else{
        movieContainer.innerHTML = 
        `
        <div id="no-data-text">
            <h2>Unable to find what you’re looking for. Please try another search.</h2>
        </div>
        `
        searchInput.value = ""
        searchInput.placeholder = "Searching something with no data"
    }
}

// Searching for movie
searchBtn.addEventListener("click", function(e){
    e.preventDefault()
    movieTitle = searchInput.value
    getData()
})

// Rendering data by Title, and IMDB
async function renderData(movies){
    let newHtml = ""
    for(let movie of movies){
        let imdb = movie.imdbID
        const res = await fetch(`https://www.omdbapi.com/?i=${imdb}&apikey=b2ab14a8`)
        const data = await res.json()
        newHtml += 
        `
        <div class="movie-section">
            <div>
                <img id="poster-img" src="${movie.Poster}"/>
            </div>
            <div class="text-section">
                <div class="movie-heading">
                    <h2>${movie.Title}</h2>
                    <i class="fa fa-star"></i>
                    <p>${data.imdbRating}</p>
                </div>
                <div class="movie-details">
                    <p>${data.Runtime}</p>
                    <p>${data.Genre}</p>
                    <button class="add-btn" data-id="${data.imdbID}">
                        <i class="fa fa-plus-circle"></i> 
                        <span>Watchlist</span>            
                    </button>
                </div>
                <div class="movie-plot">
                    <p>${data.Plot}</p>
                </div>
            </div>
        </div>
        `
    }
    movieContainer.innerHTML = newHtml
}


document.addEventListener("click", function(e){
    const addButton = e.target.closest(".add-btn")
    if(addButton){
        const movieId = addButton.dataset.id
        let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []
        if(!watchlist.includes(movieId)){
            watchlist.push(movieId)
        }
        localStorage.setItem("watchlist", JSON.stringify(watchlist))
    }
})
