const watchlistContainer = document.getElementById("watchlist-container")
const addMovies = document.getElementById("btn")

addMovies.addEventListener("click", function(){
    window.location.href = "index.html"
})

async function renderData(){
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || []
    if (watchlist.length === 0) {
        watchlistContainer.style.height = "650px"
        watchlistContainer.innerHTML = `
                <h2>Your watchlist is looking a little empty...</h2>
                <a class="add-btn" id="btn" href="index.html">
                    <i class="fa fa-plus-circle"></i> 
                    <span>Let’s add some movies!</span>            
                </a>
                `
        return
    }

    let imdbArray = JSON.parse(localStorage.getItem("watchlist"))
    let newHtml = ""
    for(let imdb of imdbArray){
        const res = await fetch(`http://www.omdbapi.com/?i=${imdb}&apikey=b2ab14a8`)
        const data = await res.json()
        newHtml += 
        `
        <div class="movie-section">
            <div>
                <img id="poster-img" src="${data.Poster}"/>
            </div>
            <div class="text-section">
                <div class="movie-heading">
                    <h2>${data.Title}</h2>
                    <i class="fa fa-star"></i>
                    <p>${data.imdbRating}</p>
                </div>
                <div class="movie-details">
                    <p>${data.Runtime}</p>
                    <p>${data.Genre}</p>
                    <button class="remove-btn" data-id="${data.imdbID}">
                        <i class="fa fa-minus-circle"></i> 
                        <span>Remove</span>            
                    </button>
                </div>
                <div class="movie-plot">
                    <p>${data.Plot}</p>
                </div>
            </div>
        </div>
        `
    }
    watchlistContainer.innerHTML = newHtml
}
renderData()

document.addEventListener("click", function(e){
    const removeButton = e.target.closest(".remove-btn")
    if(removeButton){
        const movieId = removeButton.dataset.id
        let watchlist = JSON.parse(localStorage.getItem("watchlist"))

        watchlist = watchlist.filter(function(id){
            return id !== movieId
        })
        localStorage.setItem("watchlist", JSON.stringify(watchlist))
        renderData()
        
    }
})
