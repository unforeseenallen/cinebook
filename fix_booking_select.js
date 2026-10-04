
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");

text = text.replace(/\r\n/g, "\n");

// Update getShowsForSelectedMovie to use "movie" instead of "movieSelect" since the ID is "movie"
text = text.replace(`const movieEl = document.getElementById("movieSelect");`, `const movieEl = document.getElementById("movie");`);

// Add dynamic injection to initializeBookingPage
const oldInit = `function initializeBookingPage() {
    const movie = localStorage.getItem("movie");
    const movieSelect = document.getElementById("movie");`;

const newInit = `function initializeBookingPage() {
    const movie = localStorage.getItem("movie");
    const movieSelect = document.getElementById("movie");
    
    // Inject dynamic movies into select
    if (movieSelect) {
        const addedMovies = JSON.parse(localStorage.getItem("cinebookAddedMovies")) || [];
        addedMovies.forEach(m => {
            // Check if not already in dropdown
            let exists = Array.from(movieSelect.options).some(opt => opt.value === m.title);
            if (!exists) {
                const opt = document.createElement("option");
                opt.value = m.title;
                opt.innerText = m.title;
                movieSelect.appendChild(opt);
            }
        });
        
        // Remove deleted movies
        const deletedMovies = JSON.parse(localStorage.getItem("cinebookDeletedMovies")) || [];
        Array.from(movieSelect.options).forEach(opt => {
            if(deletedMovies.includes(opt.value)) opt.remove();
        });
    }`;

text = text.replace(oldInit, newInit);

fs.writeFileSync("script.js", text, "utf8");

