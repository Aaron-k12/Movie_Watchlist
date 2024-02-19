let movieList = document.getElementById('main-page')
let movieArray = []
let imdbIDMovieList = []

document.addEventListener('click', (e) => {
    e.target.id === 'search-btn' && getMovieTitle()
    e.target.dataset.add && addToList(e.target.dataset.add)
    e.target.dataset.remove && deleteMovieFromList(e.target.dataset.remove)
})


// function to get movie's by title
function getMovieTitle() {
    let movieTitle = document.getElementById('movie-title')

    if (!movieTitle.value) {
        movieList.innerHTML = `
        <p class="error-message">Unable to find what you are looking <span> for
        please try another search</span></p>
           `
    } else {
        //API implementation
        handleFetch(movieTitle.value)
    }

    movieTitle.value = ''
}


// function to add seleted movie to watchlist
function addToList(imdbID){
    //const movie = movieArray.find(movieDetails => movieDetails.imdbID === imdbID)
    // funtion to add movie to local storage


    if (!imdbIDMovieList.includes(imdbID)){
        imdbIDMovieList.unshift(imdbID)
    }
    storeMoviesInLocalStorage(imdbIDMovieList)

}

// funtion to remove movie from list
function deleteMovieFromList(imdbID){
    let storedMoviesImdbId = getMoviesInLocalStorage()

    let indexOfMovie = storedMoviesImdbId.findIndex(movie => movie === imdbID)

    if (indexOfMovie !== -1) {
        storedMoviesImdbId.splice(indexOfMovie, 1);
        storeMoviesInLocalStorage(storedMoviesImdbId)
        renderWatchlistPage()
    }

 }


// function to search movie by title
async function handleFetch(movieTitle) {
  // clearing movie list
  movieList.innerHTML = ''

  let url = `https://www.omdbapi.com/?s=${movieTitle}&apikey=de5594b7`

  const response = await fetch(url)
       const data = await response.json()

    //    if (!data.Search)
        returnMovieById(data.Search)

}

// function to store movies id in localstorage
function storeMoviesInLocalStorage(imdbIDMovieList) {
    localStorage.setItem('addedMovie', JSON.stringify(imdbIDMovieList))
}

// function to retrieve movies from local storage
function getMoviesInLocalStorage() {
    const storedMovies = JSON.parse(localStorage.getItem('addedMovie'))
    return storedMovies
}


// function to render movies added in the watchlist page
function renderWatchlistPage() {
    const moviesAdded = getMoviesInLocalStorage()
    const watchListPage = document.getElementById('watchlist-page')
 
 
 
    if (watchListPage) {
         watchListPage.innerHTML = ''
 
         for ( let eachMovie of moviesAdded) {
             fetch (`https://www.omdbapi.com/?i=${eachMovie}&apikey=de5594b7`)
                  .then(response => response.json())
                  .then(data => {
                     watchListPage.innerHTML +=  `
                              <div class="movie-list">
                                 <img src=${data.Poster} alt="poster of ${data.Title}">
                                 <div class="movie-details">
                                       <div class="movie-details-1">
                                               <p>${data.Title}</p>
                                               <i class="fa-solid fa-star"></i>
                                               <p>${data.imdbRating}</p>
                                       </div>
                                       <div class="movie-details-2">
                                               <p>${data.Runtime}</p>
                                               <p>${data.Genre}</p>
                                               <div class="watchlist">
                                                   <i class="fa-solid fa-minus" id="watchlistID-${data.imdbID}" data-remove="${data.imdbID}"></i>
                                                   <label for="watchlistID-${data.imdbID}">Remove</label>
                                               </div>
                                       </div>
                                       <p class="summary">${data.Plot}</p>
                                 </div>
 
                              </div>
                              `
 
             })}
 
                checkWatchlistArray(moviesAdded)
                    
    }}


// function to search movie by ID
async function returnMovieById(moviesBySearchArray) {

    for (const movie of moviesBySearchArray) {
        const url = `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=de5594b7`
        const response = await fetch(url)
        const data = await response.json()
        movieArray.push(data)
        renderMovies(data)
    }
}

// funtion to check if watchlist is empty
function checkWatchlistArray(moviesToBeWatched) {
    if (moviesToBeWatched === undefined || moviesToBeWatched.length == 0) {
        document.getElementById('watchlist-page').innerHTML = `
                                                              <div class="watchlist-error-message">
                                                                      <p class="error-message">Your watchlist is looking a little empty...</p>
                                                                      <div class="error-message-section">
                                                                          <a href="index.html"><i class="fa-solid fa-plus"></i></a>
                                                                              <p class="error-message add-msg">Let’s add some movies!</p>    
                                                                      </div>
                                                               </div>`
     }

}

// function to render movies searched
function renderMovies(data) {
        movieList.innerHTML += `
       <div class="movie-list">
          <img src=${data.Poster} alt="poster of ${data.Title}">
          <div class="movie-details">
                <div class="movie-details-1">
                        <p>${data.Title}</p>
                        <i class="fa-solid fa-star"></i>
                        <p>${data.imdbRating}</p>
                </div>
                <div class="movie-details-2">
                        <p>${data.Runtime}</p>
                        <p>${data.Genre}</p>
                        <div class="watchlist">
                            <i class="fa-solid fa-plus" id="watchlistID-${data.imdbID}" data-add="${data.imdbID}"></i>
                            <label for="watchlistID-${data.imdbID}">Watchlist</label>
                        </div>
                </div>
                <p class="summary">${data.Plot}</p>
          </div>

       </div>
       `
}

window.addEventListener("load", function() {
    renderWatchlistPage()
})