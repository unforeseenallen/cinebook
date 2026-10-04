
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");

text = text.replace(/\r\n/g, "\n");

const oldGetShows = `function getShowsForSelectedMovie() {
    const movie = document.getElementById("movieSelect");
    return movie ? movieShowSchedule[movie.value] || [] : [];
}`;

const newGetShows = `function getShowsForSelectedMovie() {
    const movieEl = document.getElementById("movieSelect");
    if(!movieEl) return [];
    
    const movieVal = movieEl.value;
    
    // Check if it's an added movie
    const addedMovies = JSON.parse(localStorage.getItem("cinebookAddedMovies")) || [];
    const customMovie = addedMovies.find(m => m.title === movieVal);
    
    if (customMovie && customMovie.times) {
        return [
            { theatre: "CineBook Premium", screen: "Screen X", times: customMovie.times }
        ];
    }
    
    return movieShowSchedule[movieVal] || [];
}`;

text = text.replace(oldGetShows, newGetShows);

fs.writeFileSync("script.js", text, "utf8");

