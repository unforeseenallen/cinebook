
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");

const movieLogic = `
/* =========================================
   ADMIN MOVIE MANAGEMENT
========================================= */
function getGlobalMovies() {
    let baseMovies = [
        {title: "Khalifa", price: 250, times: ["10:00 AM", "01:30 PM", "05:00 PM", "08:30 PM"]},
        {title: "Spiderman Brand New Day", price: 180, times: ["10:00 AM", "01:30 PM", "05:00 PM", "08:30 PM"]},
        {title: "Jailer2", price: 220, times: ["10:00 AM", "01:30 PM", "05:00 PM", "08:30 PM"]},
        {title: "Bethlehem Kudumba Unit", price: 160, times: ["10:00 AM", "01:30 PM", "05:00 PM", "08:30 PM"]},
        {title: "Im Game", price: 220, times: ["10:00 AM", "01:30 PM", "05:00 PM", "08:30 PM"]},
        {title: "Toxic", price: 220, times: ["10:00 AM", "01:30 PM", "05:00 PM", "08:30 PM"]},
        {title: "Avengers End Game encore", price: 220, times: ["10:00 AM", "01:30 PM", "05:00 PM", "08:30 PM"]},
        {title: "Scene", price: 200, times: ["10:00 AM", "01:30 PM", "05:00 PM", "08:30 PM"]},
        {title: "Dooms Day", price: 300, times: ["10:00 AM", "01:30 PM", "05:00 PM", "08:30 PM"]}
    ];
    
    const deletedMovies = JSON.parse(localStorage.getItem("cinebookDeletedMovies")) || [];
    const addedMovies = JSON.parse(localStorage.getItem("cinebookAddedMovies")) || [];
    
    let activeMovies = baseMovies.filter(m => !deletedMovies.includes(m.title));
    addedMovies.forEach(m => activeMovies.push(m));
    
    return activeMovies;
}

function adminAddMovie() {
    const title = document.getElementById("mTitle").value.trim();
    const details = document.getElementById("mDetails").value.trim();
    const trailer = document.getElementById("mTrailer").value.trim();
    const price = Number(document.getElementById("mPrice").value);
    const times = document.getElementById("mTimes").value.split(",").map(t => t.trim());
    const image = document.getElementById("mImage").value.trim();
    
    if(!title || !price || times.length === 0) {
        alert("Please fill required fields (Title, Price, Times)");
        return;
    }
    
    const addedMovies = JSON.parse(localStorage.getItem("cinebookAddedMovies")) || [];
    addedMovies.push({ title, details, trailer, price, times, image: image || "images/movie1.jpg" });
    localStorage.setItem("cinebookAddedMovies", JSON.stringify(addedMovies));
    
    alert(title + " has been successfully published!");
    document.getElementById("mTitle").value = "";
    loadAdminData(); // Refresh table
}

function adminDeleteMovie(title) {
    if(confirm("Are you sure you want to delete " + title + " from the website?")) {
        const deletedMovies = JSON.parse(localStorage.getItem("cinebookDeletedMovies")) || [];
        deletedMovies.push(title);
        localStorage.setItem("cinebookDeletedMovies", JSON.stringify(deletedMovies));
        
        // Also remove from added if it was an added movie
        let addedMovies = JSON.parse(localStorage.getItem("cinebookAddedMovies")) || [];
        addedMovies = addedMovies.filter(m => m.title !== title);
        localStorage.setItem("cinebookAddedMovies", JSON.stringify(addedMovies));
        
        loadAdminData();
    }
}

// Modify DOM on home page to show/hide movies
document.addEventListener("DOMContentLoaded", function() {
    const currentPage = window.location.pathname.split("/").pop();
    if(currentPage === "index.html" || currentPage === "") {
        const deletedMovies = JSON.parse(localStorage.getItem("cinebookDeletedMovies")) || [];
        document.querySelectorAll(".movie-card").forEach(card => {
            const titleEl = card.querySelector("h3");
            if(titleEl && deletedMovies.includes(titleEl.innerText.trim())) {
                card.style.display = "none";
            }
        });
        
        const addedMovies = JSON.parse(localStorage.getItem("cinebookAddedMovies")) || [];
        const grid = document.querySelector(".movies-grid");
        if(grid) {
            addedMovies.forEach(m => {
                const div = document.createElement("div");
                div.className = "movie-card";
                div.innerHTML = \`
                    <img src="\${m.image}" alt="\${m.title}">
                    <div class="movie-info">
                        <h3>\${m.title}</h3>
                        <p>\${m.details}</p>
                        <p class="movie-story">New highly anticipated release.</p>
                        <div class="movie-buttons">
                            <button onclick="startBooking('\${m.title}', \${m.price})">Book Now</button>
                            <button class="cart-btn" onclick="addToCart('\${m.title}', \${m.price})">+ Cart</button>
                            <button class="trailer-btn" onclick="openTrailer('\${m.trailer}')">Trailer</button>
                        </div>
                    </div>
                \`;
                grid.appendChild(div);
            });
        }
    }
});
`;

text = text + "\n\n" + movieLogic;

fs.writeFileSync("script.js", text, "utf8");

