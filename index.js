let movieList = document.getElementById('main-page')

let movieArray = [];

document.addEventListener('click', (e) => {
    e.target.id === 'search-btn' && searchMovie()
    e.target.dataset.imdbid && addToList(e.target.dataset.imdbid)
})


function searchMovie() {
    let moveTitle = document.getElementById('movie-title')

    //API implementation
    searchMovieByTitle(moveTitle.value)
}

async function searchMovieByTitle(movieTitle) {

  
  let url = `http://www.omdbapi.com/?s=${movieTitle}&apikey=de5594b7`

  const response = await fetch(url)
       const data = await response.json()
       
       if (!data.Search) {
        
         movieList.innerHTML = `
        <p class="sub-section">Unable to find what you are looking for
        please try another search</p>
           `
       } else {
        moviesBySearchArray = data.Search
        returnMovieById(moviesBySearchArray)
       }     
}


async function returnMovieById(moviesBySearchArray) {

    for (const movie of moviesBySearchArray) {
        const url = `http://www.omdbapi.com/?i=${movie.imdbID}&apikey=de5594b7`
        const response = await fetch(url)
        const data = await response.json()
        movieArray.push(data)
        renderMovies(data)
    }
}


function addToList(imdbID){
   console.log(movieArray)
    
}

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
                            <button id="watchlistID-${data.imdbID}" data-imdbID="${data.imdbID}" class="addmovie-btn">+</button>
                            <label for="watchlistID-${data.imdbID}">Watchlist</label>
                        </div>
            
                       
                </div>
                <p class="summary">${data.Plot}</p>
          </div>
          
       </div>
       `
}

