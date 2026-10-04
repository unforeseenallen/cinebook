
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");

const newLoadShowtimes = `function loadShowtimes() {
    const movie = localStorage.getItem("movie");
    if (!movie) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("movieTitle").innerText = movie;
    const timeGrid = document.getElementById("timeGrid");
    timeGrid.innerHTML = "";

    // Check if it's an added movie
    let times = ["10:00 AM", "01:30 PM", "06:00 PM"];
    const addedMovies = JSON.parse(localStorage.getItem("cinebookAddedMovies")) || [];
    const customMovie = addedMovies.find(m => m.title === movie);
    
    if (customMovie && customMovie.times) {
        times = customMovie.times;
    } else if (movieShowSchedule[movie]) {
        times = movieShowSchedule[movie];
    }`;

text = text.replace(/function loadShowtimes\(\) \{[\s\S]*?times = movieShowSchedule\[movie\] \|\| \["10:00 AM", "01:30 PM", "06:00 PM"\];/, newLoadShowtimes);

fs.writeFileSync("script.js", text, "utf8");

