
/* =========================================
   LOGIN GATE PROTECTION
========================================= */
(function() {
    const isLoggedIn = localStorage.getItem("cinebookLoggedIn") === "true";
    const currentPage = window.location.pathname.split("/").pop();
    
    // Pages that don't require redirecting TO login (i.e. already login page)
    const isLoginPage = currentPage === "login.html" || currentPage === "";
    
    // Protect Admin Page
    if (currentPage === "admin.html" && localStorage.getItem("cinebookRole") !== "admin") {
        window.location.href = "login.html";
    }
    
    if (!isLoggedIn && currentPage !== "login.html") {
        window.location.href = "login.html";
    } else if (isLoggedIn && currentPage === "login.html") {
        if (localStorage.getItem("cinebookRole") === "admin") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "index.html";
        }
    }
})();

﻿/* =========================================
   CINEBOOK BOOKING SYSTEM
========================================= */

/* =========================================
   LOGIN SYSTEM
========================================= */

let loginMode = "login";

function openLogin() {
    const modal = document.getElementById("loginModal");
    loginMode = "login";
    updateLoginGreeting();
    if (modal) modal.style.display = "flex";
}

function closeLogin() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.style.display = "none";
}

function logoutUser() {
    localStorage.removeItem("cinebookLoggedIn");
    localStorage.removeItem("cinebookEmail");
    ["movie", "price", "theatre", "screen", "date", "time", "selectedSeats", "bookingId", "paymentMethod", "paymentStatus", "pendingMovie", "pendingPrice"].forEach(function (key) {
        localStorage.removeItem(key);
    });
    
}

function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Please enter email and password.");
        return;
    }

    const previousEmail = localStorage.getItem("cinebookEmail") || "";

    if (previousEmail && previousEmail.toLowerCase() !== email.toLowerCase()) {
        migrateLegacyAccountData(previousEmail);
    }

    localStorage.setItem("cinebookLoggedIn", "true");
    localStorage.setItem("cinebookEmail", email);
    
    // Admin Check
    if (email.toLowerCase() === "admin@cinebook.com" && password === "admin123") {
        localStorage.setItem("cinebookRole", "admin");
    } else {
        localStorage.setItem("cinebookRole", "user");
    }
    
    migrateLegacyAccountData(email);

    if (previousEmail && previousEmail.toLowerCase() !== email.toLowerCase()) {
        ["movie", "price", "theatre", "screen", "date", "time", "selectedSeats", "bookingId", "paymentMethod", "paymentStatus"].forEach(function (key) {
            localStorage.removeItem(key);
        });
    }
    loginMode = "login";
    updateLoginGreeting();

    closeLogin();

    const pendingMovie = localStorage.getItem("pendingMovie");
    const pendingPrice = localStorage.getItem("pendingPrice");

    if (pendingMovie) {
        localStorage.setItem("movie", pendingMovie);
        localStorage.setItem("price", pendingPrice || "200");

        localStorage.removeItem("pendingMovie");
        localStorage.removeItem("pendingPrice");

        window.location.href = "booking.html";
    } else {
        alert("Login successful!");
        if (localStorage.getItem("cinebookRole") === "admin") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "index.html";
        }
    }
}

/* =========================================
   PERSONALIZED LOGIN GREETING
========================================= */

function getFirstNameFromEmail(email) {
    const localPart = (email || "").split("@")[0];
    const firstName = localPart.split(/[._+\-\d]+/)[0] || localPart;
    return firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : "";
}

function updateLoginGreeting() {
    const email = localStorage.getItem("cinebookEmail") || "";
    const firstName = getFirstNameFromEmail(email);
    const title = document.getElementById("loginTitle");
    const subtitle = document.getElementById("loginSubtitle");
    const emailInput = document.getElementById("loginEmail");
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");
    const submitButton = document.getElementById("loginSubmit");
    const accountSwitch = document.getElementById("accountSwitch");

    if (loginMode === "register") {
        if (title) title.textContent = "Welcome to CineBook";
        if (subtitle) subtitle.textContent = "Create your account to save and book movie tickets.";
        if (emailInput) {
            emailInput.value = "";
            emailInput.placeholder = "Enter your Gmail address";
            emailInput.focus();
        }
        if (submitButton) submitButton.textContent = "Create Account";
        if (accountSwitch) {
            accountSwitch.innerHTML = "Already have an account? <a href='#' onclick='useRememberedAccount(); return false;'>Use saved email</a>";
        }
        return;
    }

    if (email && firstName) {
        if (title) title.textContent = "Welcome back, " + firstName + "!";
        if (subtitle) subtitle.textContent = "Sign in again with " + email + ".";
        if (emailInput) emailInput.value = email;
        if (loginButton) loginButton.textContent = "Hi, " + firstName;
        if (logoutButton) logoutButton.hidden = false;
        if (submitButton) submitButton.textContent = "Login";
        if (accountSwitch) {
            accountSwitch.innerHTML = "Not " + firstName + "? <a href='#' onclick='startRegistration(); return false;'>Register / use another email</a>";
        }
    } else {
        if (title) title.textContent = "Welcome to CineBook";
        if (subtitle) subtitle.textContent = "New here? Create an account or log in to book tickets.";
        if (loginButton) loginButton.textContent = "Login";
        if (logoutButton) logoutButton.hidden = true;
        if (submitButton) submitButton.textContent = "Login";
        if (accountSwitch) {
            accountSwitch.innerHTML = "Don't have an account? <a href='#' onclick='startRegistration(); return false;'>Register</a>";
        }
    }
}

function startRegistration() {
    loginMode = "register";
    updateLoginGreeting();
}

function useRememberedAccount() {
    loginMode = "login";
    updateLoginGreeting();
}

/* =========================================
   START BOOKING
========================================= */

function startBooking(movie, price) {
    const loggedIn = localStorage.getItem("cinebookLoggedIn");

    if (loggedIn !== "true") {
        localStorage.setItem("pendingMovie", movie);
        localStorage.setItem("pendingPrice", String(price));
        openLogin();
        return;
    }

    localStorage.setItem("movie", movie);
    localStorage.setItem("price", String(price));

    window.location.href = "booking.html";
}

/* =========================================
   CART / MY BOOKINGS
========================================= */

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(accountStorageKey("cinebookCart")) || "[]");
    } catch (error) {
        return [];
    }
}

function accountStorageKey(baseKey, email) {
    const accountEmail = (email || localStorage.getItem("cinebookEmail") || "guest").toLowerCase();
    return baseKey + ":" + encodeURIComponent(accountEmail);
}

function migrateLegacyAccountData(email) {
    ["cinebookCart", "cinebookBookings"].forEach(function (baseKey) {
        const legacyValue = localStorage.getItem(baseKey);
        const accountKey = accountStorageKey(baseKey, email);
        if (legacyValue && !localStorage.getItem(accountKey)) {
            localStorage.setItem(accountKey, legacyValue);
            localStorage.removeItem(baseKey);
        }
    });
}

function getBookings() {
    try {
        return JSON.parse(localStorage.getItem(accountStorageKey("cinebookBookings")) || "[]");
    } catch (error) {
        return [];
    }
}


function saveBookings(bookings) {
    localStorage.setItem(accountStorageKey("cinebookBookings"), JSON.stringify(bookings));
    
    // Admin Global Bookings
    const email = localStorage.getItem("cinebookEmail");
    let globalBookings = JSON.parse(localStorage.getItem("cinebookGlobalBookings")) || [];
    bookings.forEach(b => {
        const idx = globalBookings.findIndex(gb => gb.id === b.id);
        if (idx > -1) {
            globalBookings[idx] = b; // Update status if cancelled
        } else {
            b.email = email;
            globalBookings.push(b);
        }
    });
    localStorage.setItem("cinebookGlobalBookings", JSON.stringify(globalBookings));
}


function saveCart(cart) {
    localStorage.setItem(accountStorageKey("cinebookCart"), JSON.stringify(cart));
    updateCartCount();
}

function addToCart(movie, price) {
    const cart = getCart();
    const existing = cart.find(function (item) {
        return item.movie === movie;
    });

    if (!existing) {
        cart.push({ movie: movie, price: Number(price) });
        saveCart(cart);
        alert(movie + " was added to My Bookings.");
    } else {
        alert(movie + " is already in My Bookings.");
    }
}

function updateCartCount() {
    const count = document.getElementById("cartCount");
    if (count) count.textContent = getCart().length;
}

function removeFromCart(movie) {
    const cart = getCart().filter(function (item) {
        return item.movie !== movie;
    });
    saveCart(cart);
    
}

function bookFromCart(movie, price) {
    localStorage.setItem("movie", movie);
    localStorage.setItem("price", String(price));
    window.location.href = "booking.html";
}

function loadCart() {
    const bookingsList = document.getElementById("bookingsList");
    const emptyBookings = document.getElementById("emptyBookings");
    const cartList = document.getElementById("cartList");
    const emptyState = document.getElementById("emptyCart");
    const cartTotal = document.getElementById("cartTotal");
    if (!bookingsList || !emptyBookings || !cartList || !emptyState || !cartTotal) return;

    const bookings = getBookings();
    bookingsList.innerHTML = "";
    emptyBookings.style.display = bookings.length ? "none" : "block";

    
    bookings.slice().sort(function (first, second) {
        return new Date(second.bookedAt || 0) - new Date(first.bookedAt || 0);
    }).slice(0, 10).forEach(function (booking) {
        const card = document.createElement("article");
        card.className = "confirmed-booking";
        
        const isCancelled = booking.status === "CANCELLED";
        const statusClass = isCancelled ? "booking-status-cancelled" : "booking-status";
        const statusText = isCancelled ? "CANCELLED" : "CONFIRMED";
        
            cancelBtnHtml = '<button class="cancel-ticket-btn" onclick="promptCancelBooking(' + String.fromCharCode(39) + booking.id + String.fromCharCode(39) + ', ' + booking.total + ')">Cancel</button>';
        if (!isCancelled) {
            cancelBtnHtml = '<button class="cancel-ticket-btn" onclick="promptCancelBooking(' + String.fromCharCode(39) + booking.id + String.fromCharCode(39) + ', ' + booking.total + ')">Cancel</button>';
        }
        
        card.innerHTML =
            "<div><span class='" + statusClass + "'>" + statusText + "</span><h3></h3><p class='booking-meta'></p></div>" +
            "<div class='booking-price' style='text-align:right;'>₹" + booking.total + "<br><br>" + cancelBtnHtml + "</div>";
            
        card.querySelector("h3").textContent = booking.movie;
        card.querySelector(".booking-meta").textContent =
            booking.theatre + " | " + booking.date + " | " + booking.time +
            " | Seats: " + booking.seats.join(", ") + " | " + booking.id;
            
        if (isCancelled) {
            card.style.opacity = "0.5";
        }
        
        bookingsList.appendChild(card);
    });

    const cart = getCart();
    cartList.innerHTML = "";
    emptyState.style.display = cart.length ? "none" : "block";

    cart.forEach(function (item) {
        const row = document.createElement("article");
        row.className = "cart-item";
        row.innerHTML =
            "<div><h3></h3><p>Ticket price: ₹</p></div>" +
            "<div class='cart-actions'><button class='cart-book'>Choose showtime</button><button class='cart-remove'>Remove</button></div>";
        row.querySelector("h3").textContent = item.movie;
        row.querySelector("p").textContent = "Ticket price: ₹" + item.price;
        row.querySelector(".cart-book").addEventListener("click", function () {
            bookFromCart(item.movie, item.price);
        });
        row.querySelector(".cart-remove").addEventListener("click", function () {
            removeFromCart(item.movie);
        });
        cartList.appendChild(row);
    });

    cartTotal.textContent = "₹" + cart.reduce(function (sum, item) {
        return sum + item.price;
    }, 0);
    updateCartCount();
}

document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    updateLoginGreeting();
});

/* =========================================
   BOOKING PAGE
========================================= */

const movieShowSchedule = {
    "Khalifa": [
        { theatre: "INOX Mangalore", screen: "Screen 1", times: ["10:00 AM", "04:30 PM"] },
        { theatre: "PVR Cinemas", screen: "Screen 3", times: ["01:30 PM", "07:30 PM"] }
    ],
    "Spiderman Brand New Day": [
        { theatre: "PVR Cinemas", screen: "Screen 1", times: ["10:00 AM", "04:30 PM", "10:30 PM"] },
        { theatre: "Cinepolis", screen: "Screen 2", times: ["01:30 PM", "07:30 PM"] }
    ],
    "Jailer2": [
        { theatre: "INOX Mangalore", screen: "Screen 2", times: ["10:00 AM", "07:30 PM"] },
        { theatre: "Bharath Cinemas", screen: "Screen 1", times: ["01:30 PM", "04:30 PM"] }
    ],
    "Bethlehem Kudumba Unit": [
        { theatre: "Cinepolis", screen: "Screen 3", times: ["10:00 AM", "01:30 PM"] },
        { theatre: "Bharath Cinemas", screen: "Screen 2", times: ["04:30 PM", "07:30 PM"] }
    ],
    "Im Game": [
        { theatre: "PVR Cinemas", screen: "Screen 2", times: ["01:30 PM", "07:30 PM"] },
        { theatre: "INOX Mangalore", screen: "Screen 4", times: ["10:30 PM"] }
    ],
    "Toxic": [
        { theatre: "Bharath Cinemas", screen: "Screen 3", times: ["10:00 AM", "04:30 PM"] },
        { theatre: "Cinepolis", screen: "Screen 1", times: ["01:30 PM", "10:30 PM"] }
    ],
    "Avengers End Game encore": [
        { theatre: "PVR Cinemas", screen: "Screen 4", times: ["10:00 AM", "04:30 PM", "07:30 PM"] },
        { theatre: "INOX Mangalore", screen: "Screen 1", times: ["01:30 PM", "10:30 PM"] }
    ],
    "Scene": [
        { theatre: "Cinepolis", screen: "Screen 2", times: ["04:30 PM", "07:30 PM"] },
        { theatre: "PVR Cinemas", screen: "Screen 3", times: ["01:30 PM"] }
    ],
    "Dooms Day": [
        { theatre: "PVR Cinemas", screen: "Screen 1", times: ["01:30 PM", "07:30 PM"] },
        { theatre: "INOX Mangalore", screen: "Screen 3", times: ["04:30 PM", "10:30 PM"] }
    ]
};

function setSelectOptions(select, placeholder, values) {
    select.innerHTML = "";
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = placeholder;
    select.appendChild(placeholderOption);

    values.forEach(function (value) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });
}

function getShowsForSelectedMovie() {
    const movie = document.getElementById("movie");
    return movie ? movieShowSchedule[movie.value] || [] : [];
}

function updateShowAvailability() {
    const availability = document.getElementById("showAvailability");
    const shows = getShowsForSelectedMovie();
    if (!availability) return;

    if (!shows.length) {
        availability.textContent = "Select a movie to view its available theatres and shows.";
        return;
    }

    availability.textContent = shows.length + " theatres are currently showing this movie. Select a theatre to see its screen and showtimes.";
}

function populateTheatres() {
    const theatre = document.getElementById("theatre");
    const screen = document.getElementById("screen");
    const time = document.getElementById("time");
    const shows = getShowsForSelectedMovie();
    const theatres = [...new Set(shows.map(function (show) { return show.theatre; }))];

    setSelectOptions(theatre, "Select Theatre", theatres);
    setSelectOptions(screen, "Select Screen", []);
    setSelectOptions(time, "Select Show Time", []);
    updateShowAvailability();
}

function populateScreens() {
    const theatre = document.getElementById("theatre").value;
    const screen = document.getElementById("screen");
    const time = document.getElementById("time");
    const screens = getShowsForSelectedMovie()
        .filter(function (show) { return show.theatre === theatre; })
        .map(function (show) { return show.screen; });

    setSelectOptions(screen, "Select Screen", screens);
    setSelectOptions(time, "Select Show Time", []);
}

function populateShowtimes() {
    const theatre = document.getElementById("theatre").value;
    const screen = document.getElementById("screen").value;
    const time = document.getElementById("time");
    const selectedShow = getShowsForSelectedMovie().find(function (show) {
        return show.theatre === theatre && show.screen === screen;
    });

    setSelectOptions(time, "Select Show Time", selectedShow ? selectedShow.times : []);
}

function loadBooking() {
    const movie = localStorage.getItem("movie");
    const movieSelect = document.getElementById("movie");
    const dateInput = document.getElementById("date");

    if (movie && movieSelect) {
        movieSelect.value = movie;
    }

    if (dateInput) {
        dateInput.min = new Date().toISOString().split("T")[0];
    }

    if (movieSelect) {
        movieSelect.addEventListener("change", populateTheatres);
        document.getElementById("theatre").addEventListener("change", populateScreens);
        document.getElementById("screen").addEventListener("change", populateShowtimes);
        populateTheatres();
    }
}

/* =========================================
   GO TO SEATS
========================================= */

function goToSeats() {
    const movie = document.getElementById("movie").value;
    const theatre = document.getElementById("theatre").value;
    const screen = document.getElementById("screen").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (!movie) return alert("Please select a movie.");
    if (!theatre) return alert("Please select a theatre.");
    if (!screen) return alert("Please select a screen.");
    if (!date) return alert("Please select a date.");
    if (!time) return alert("Please select a show time.");

    localStorage.setItem("movie", movie);
    localStorage.setItem("theatre", theatre);
    localStorage.setItem("screen", screen);
    localStorage.setItem("date", date);
    localStorage.setItem("time", time);

    const prices = {
    "Khalifa": 200,
    "Spiderman Brand New Day": 250,
    "Dooms Day": 250,
    "Im Game": 220,
    "Bethlehem Kudumba Unit": 200,
    "Toxic": 150,
    "Avengers End Game encore": 250,

    // Coming Soon Movies
    "Scene": 200,
    "Dooms Day": 300,
    "Movie 3": 250
};

const price = prices[movie] || Number(localStorage.getItem("price")) || 200;

localStorage.setItem("price", String(price));

// Clear previous seat selections when starting a new show.
localStorage.removeItem("selectedSeats");
localStorage.removeItem("bookingId");
localStorage.removeItem("paymentMethod");
localStorage.removeItem("paymentStatus");

window.location.href = "seats.html";

    // Clear previous seat selections when starting a new show.
    localStorage.removeItem("selectedSeats");
    localStorage.removeItem("bookingId");
    localStorage.removeItem("paymentMethod");
    localStorage.removeItem("paymentStatus");

    window.location.href = "seats.html";
}

/* =========================================
   SEAT CATEGORIES & PRICING
========================================= */

const seatPricing = {
    "RECLINER ROWS": 280,
    "PRIME ROWS": 170,
    "EXTRA LEGROOM ROWS": 200,
    "CLASSIC PLUS ROWS": 150,
    "CLASSIC ROWS": 105
};

function getSeatPrice(seatId) {
    // seatId format: "Row-Num" e.g., "K-5"
    const row = seatId.split("-")[0];
    if (row === "K") return seatPricing["RECLINER ROWS"];
    if (row === "J" || row === "H") return seatPricing["PRIME ROWS"];
    if (row === "G") return seatPricing["EXTRA LEGROOM ROWS"];
    if (["F", "E", "D", "C"].includes(row)) return seatPricing["CLASSIC PLUS ROWS"];
    return seatPricing["CLASSIC ROWS"];
}

function calculateTotal(seats) {
    return seats.reduce(function (sum, seatId) {
        return sum + getSeatPrice(seatId);
    }, 0);
}

/* =========================================
   CREATE SEATS
========================================= */

function createSeats() {
    const container = document.getElementById("seats");
    if (!container) return;

    container.innerHTML = "";

    // The layout based on the provided design
    const layout = [
        { category: "RECLINER ROWS: ₹280", rows: [{ label: "K", start: 3, end: 11 }] },
        { category: "PRIME ROWS: ₹170", rows: [
            { label: "J", start: 2, end: 15 },
            { label: "H", start: 1, end: 15, occupied: [1,2,3,4,5,6,7,8] } // X marks in screenshot
        ]},
        { category: "EXTRA LEGROOM ROWS: ₹200", rows: [{ label: "G", start: 2, end: 15 }] },
        { category: "CLASSIC PLUS ROWS: ₹150", rows: [
            { label: "F", start: 1, end: 12 },
            { label: "E", start: 1, end: 12 },
            { label: "D", start: 1, end: 12 },
            { label: "C", start: 1, end: 12 }
        ]},
        { category: "CLASSIC ROWS: ₹105", rows: [
            { label: "B", start: 1, end: 12 },
            { label: "A", start: 1, end: 12 }
        ]}
    ];

    layout.forEach(function (section) {
        // Category Header
        const header = document.createElement("div");
        header.classList.add("seat-category-header");
        header.innerText = section.category;
        container.appendChild(header);

        // Render each row in this category
        section.rows.forEach(function (rowData) {
            const rowWrapper = document.createElement("div");
            rowWrapper.classList.add("seat-row-wrapper");

            // Row Label (K, J, etc)
            const label = document.createElement("div");
            label.classList.add("row-label");
            label.innerText = rowData.label;
            rowWrapper.appendChild(label);

            const rowDiv = document.createElement("div");
            rowDiv.classList.add("seat-row");

            for (let i = rowData.start; i <= rowData.end; i++) {
                const seat = document.createElement("div");
                seat.classList.add("seat");
                seat.innerText = i;
                
                // Store unique ID like K-5
                const seatId = rowData.label + "-" + i;
                seat.dataset.seat = seatId;

                // Mark occupied
                const screen = localStorage.getItem("screen");
                const isOccupied = (rowData.occupied && rowData.occupied.includes(i)) || 
                                   (Math.random() < 0.15); // Randomly occupy 15% of seats for realism across screens

                if (isOccupied) {
                    seat.classList.add("occupied-seat");
                    // Keep the number, just let CSS grey it out
                } else {
                    // Define best seats (Center seats in Row G & F)
                    const isBestSeat = (rowData.label === "G" && [7, 8, 9, 10].includes(i)) || 
                                       (rowData.label === "F" && [5, 6, 7, 8].includes(i));
                    
                    if (isBestSeat) {
                        seat.classList.add("best-seat");
                    }
                }

                seat.addEventListener("click", function () {
                    if (seat.classList.contains("occupied-seat")) return;
                    seat.classList.toggle("selected-seat");
                    updateSeats();
                });

                rowDiv.appendChild(seat);
            }

            rowWrapper.appendChild(rowDiv);
            container.appendChild(rowWrapper);
        });
    });



    // Restore selections
    const savedSeats = JSON.parse(localStorage.getItem("selectedSeats") || "[]");
    savedSeats.forEach(function (seatId) {
        const seat = container.querySelector('[data-seat="' + seatId + '"]');
        if (seat && !seat.classList.contains("occupied-seat")) {
            seat.classList.add("selected-seat");
        }
    });

    updateSeats();
}

/* =========================================
   UPDATE SEATS
========================================= */

function updateSeats() {
    const selected = document.querySelectorAll(".selected-seat");
    const seats = [];

    selected.forEach(function (seat) {
        seats.push(seat.dataset.seat);
    });

    localStorage.setItem("selectedSeats", JSON.stringify(seats));

    const price = Number(localStorage.getItem("price")) || 200;
    const total = calculateTotal(seats);

    const selectedElement = document.getElementById("selectedSeats");
    const totalElement = document.getElementById("seatTotal");

    if (selectedElement) {
        selectedElement.innerText = seats.length ? seats.join(", ") : "None";
    }

    if (totalElement) {
        totalElement.innerText = total;
    }
}

/* =========================================
   GO TO PAYMENT
========================================= */

function goToPayment() {
    const seats = JSON.parse(localStorage.getItem("selectedSeats") || "[]");

    if (seats.length === 0) {
        alert("Please select at least one seat.");
        return;
    }

    window.location.href = "payment.html";
}

/* =========================================
   LOAD PAYMENT
========================================= */

function loadPayment() {
    const movie = localStorage.getItem("movie") || "-";
    const theatre = localStorage.getItem("theatre") || "-";
    const screen = localStorage.getItem("screen") || "-";
    const date = localStorage.getItem("date") || "-";
    const time = localStorage.getItem("time") || "-";
    const email = localStorage.getItem("cinebookEmail") || "-";

    const seats = JSON.parse(localStorage.getItem("selectedSeats") || "[]");
    const price = Number(localStorage.getItem("price")) || 200;
    const total = calculateTotal(seats);

    const fields = {
        payMovie: movie,
        payTheatre: theatre,
        payScreen: screen,
        payDate: date,
        payTime: time,
        paySeats: seats.length ? seats.join(", ") : "-",
        payEmail: email,
        payTotal: total
    };

    Object.keys(fields).forEach(function (id) {
        const element = document.getElementById(id);
        if (element) element.innerText = fields[id];
    });

    const upiQrCode = document.getElementById("upiQrCode");
    if (upiQrCode) {
        upiQrCode.src = createPaymentQrUrl(total);
    }

    // Wallet Section Logic
    const bal = getWalletBalance();
    if (bal > 0) {
        const wSec = document.getElementById("walletSection");
        const wBal = document.getElementById("walletBalanceDisplay");
        if (wSec && wBal) {
            wSec.style.display = "block";
            wBal.innerText = bal;
        }
    }

    // UPI is selected by default.
    showUPI();
}

function getPaymentRequestLink() {
    const seats = JSON.parse(localStorage.getItem("selectedSeats") || "[]");
    const price = Number(localStorage.getItem("price")) || 200;
    const total = calculateTotal(seats);
    const bookingNote = "CineBook tickets - " + (localStorage.getItem("movie") || "Movie tickets");
    const upiId = "cinebook@upi"; // Replace with your real merchant UPI ID before launch.

    return "upi://pay?pa=" + encodeURIComponent(upiId) +
        "&pn=" + encodeURIComponent("CineBook") +
        "&am=" + encodeURIComponent(total.toFixed(2)) +
        "&cu=INR&tn=" + encodeURIComponent(bookingNote);
}

function createPaymentQrUrl(total) {
    const paymentLink = getPaymentRequestLink();
    return "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" + encodeURIComponent(paymentLink);
}

async function copyPaymentLink() {
    const paymentLink = getPaymentRequestLink();
    try {
        await navigator.clipboard.writeText(paymentLink);
        alert("UPI payment link copied. Send it to your friend.");
    } catch (error) {
        window.prompt("Copy this UPI payment link and send it to your friend:", paymentLink);
    }
}

async function sharePaymentRequest() {
    const paymentLink = getPaymentRequestLink();
    const movie = localStorage.getItem("movie") || "movie tickets";
    const text = "Can you pay for my CineBook tickets for " + movie + "? Use this UPI payment link: " + paymentLink;

    if (navigator.share) {
        try {
            await navigator.share({ title: "CineBook payment request", text: text });
            return;
        } catch (error) {
            if (error.name === "AbortError") return;
        }
    }

    try {
        await navigator.clipboard.writeText(text);
        alert("Payment request copied. Paste it into WhatsApp, Gmail, or another app.");
    } catch (error) {
        window.prompt("Copy this payment request and send it to your friend:", text);
    }
}

/* =========================================
   COMPLETE PAYMENT
========================================= */

function completePayment() {
    const payment = document.querySelector('input[name="payment"]:checked');

    if (!payment) {
        alert("Please select a payment method.");
        return;
    }

    const email = localStorage.getItem("cinebookEmail");

    if (!email) {
        alert("Please login before making a payment.");
        openLogin();
        return;
    }

    const seats = JSON.parse(localStorage.getItem("selectedSeats") || "[]");

    if (seats.length === 0) {
        alert("Please select at least one seat.");
        return;
    }

    const bookingId = "CB" + Math.floor(100000 + Math.random() * 900000);

    localStorage.setItem("bookingId", bookingId);
    
    let methodString = payment.value;
    if (typeof walletUsedAmount !== "undefined" && walletUsedAmount > 0) {
        updateWalletBalance(-walletUsedAmount);
        methodString += " + Wallet";
    }
    
    localStorage.setItem("paymentMethod", methodString);
    localStorage.setItem("paymentStatus", "Paid");

    const bookings = getBookings();
    bookings.push({
        id: bookingId,
        movie: localStorage.getItem("movie") || "-",
        theatre: localStorage.getItem("theatre") || "-",
        screen: localStorage.getItem("screen") || "-",
        date: localStorage.getItem("date") || "-",
        time: localStorage.getItem("time") || "-",
        seats: seats,
        total: calculateTotal(seats),
        paymentMethod: methodString,
        bookedAt: new Date().toISOString()
    });
    saveBookings(bookings);

    const bookedMovie = localStorage.getItem("movie");
    const remainingCart = getCart().filter(function (item) {
        return item.movie !== bookedMovie;
    });
    saveCart(remainingCart);

    alert(
        "Payment successful using " +
        payment.value +
        "!\n\nBooking ID: " +
        bookingId
    );

    window.location.href = "confirmation.html";
}

/* =========================================
   LOAD CONFIRMATION
========================================= */

function loadConfirmation() {
    const movie = localStorage.getItem("movie") || "-";
    const theatre = localStorage.getItem("theatre") || "-";
    const screen = localStorage.getItem("screen") || "-";
    const date = localStorage.getItem("date") || "-";
    const time = localStorage.getItem("time") || "-";
    const email = localStorage.getItem("cinebookEmail") || "-";

    const seats = JSON.parse(localStorage.getItem("selectedSeats") || "[]");
    const price = Number(localStorage.getItem("price")) || 200;
    const total = calculateTotal(seats);

    const bookingId = localStorage.getItem("bookingId") || "-";
    const paymentMethod = localStorage.getItem("paymentMethod") || "-";
    const paymentStatus = localStorage.getItem("paymentStatus") || "Pending";

    const belongsToActiveUser = getBookings().some(function (booking) {
        return booking.id === bookingId;
    });

    if (!email || bookingId === "-" || paymentStatus !== "Paid" || !belongsToActiveUser) {
        window.location.replace("index.html");
        return;
    }

    const fields = {
        confirmMovie: movie,
        confirmTheatre: theatre,
        confirmScreen: screen,
        confirmDate: date,
        confirmTime: time,
        confirmSeats: seats.length ? seats.join(", ") : "-",
        confirmEmail: email,
        confirmPayment: paymentStatus === "Paid" ? "Paid (" + paymentMethod + ")" : "Pending",
        confirmTotal: total,
        bookingId: bookingId
    };

    Object.keys(fields).forEach(function (id) {
        const element = document.getElementById(id);
        if (element) element.innerText = fields[id];
    });

    const qrCode = document.getElementById("qrCode");

    if (qrCode && bookingId !== "-") {
        const qrData =
            "CINEBOOK E-TICKET\n" +
            "Booking ID: " + bookingId + "\n" +
            "Movie: " + movie + "\n" +
            "Theatre: " + theatre + "\n" +
            "Screen: " + screen + "\n" +
            "Date: " + date + "\n" +
            "Time: " + time + "\n" +
            "Seats: " + seats.join(", ") + "\n" +
            "Email: " + email;

        qrCode.src =
            "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
            encodeURIComponent(qrData);
    }

    // ── Automatically send the e-ticket email ──
    sendTicketEmail();
}

/* =========================================
   SEND E-TICKET EMAIL (AUTOMATIC via EmailJS)
========================================= */

// IMPORTANT: Initialize EmailJS with your Public Key
// We will do this right before sending.

async function sendTicketEmail() {
    const email = localStorage.getItem("cinebookEmail");
    const bookingId = localStorage.getItem("bookingId") || "-";
    const statusEl = document.getElementById("emailStatus");
    const sendBtn = document.getElementById("sendEmailBtn");

    if (!email || bookingId === "-") {
        if (statusEl) statusEl.textContent = "⚠️ Cannot send — missing email or booking.";
        return;
    }

    const movie = localStorage.getItem("movie") || "-";
    const theatre = localStorage.getItem("theatre") || "-";
    const screen = localStorage.getItem("screen") || "-";
    const date = localStorage.getItem("date") || "-";
    const time = localStorage.getItem("time") || "-";
    const seats = JSON.parse(localStorage.getItem("selectedSeats") || "[]");
    const price = Number(localStorage.getItem("price")) || 200;
    const total = calculateTotal(seats);

    // Show sending state
    if (statusEl) {
        statusEl.textContent = "📧 Sending e-ticket to " + email + "...";
        statusEl.className = "email-status sending";
    }
    if (sendBtn) sendBtn.disabled = true;

    // Generate QR Code URL using QuickChart without the '&' character to prevent EmailJS from breaking the URL
    const qrData = [
        "CINEBOOK E-TICKET",
        "Booking ID: " + bookingId,
        "Movie: " + movie,
        "Theatre: " + theatre,
        "Screen: " + screen,
        "Date: " + date,
        "Time: " + time,
        "Seats: " + seats.join(", "),
        "Email: " + email
    ].join("\n");
    const qrUrl = "https://quickchart.io/qr?text=" + encodeURIComponent(qrData);

    try {
        // REPLACE THESE 3 VALUES WITH YOUR EMAILJS KEYS
        const EMAILJS_PUBLIC_KEY = "OFIc6nWwL4ly8N_uB";
        const EMAILJS_SERVICE_ID = "service_ji15w69";
        const EMAILJS_TEMPLATE_ID = "template_fug98m4";

        const templateParams = {
            to_email: email,
            booking_id: bookingId,
            movie_name: movie,
            theatre: theatre,
            screen: screen,
            date: date,
            time: time,
            seats: seats.join(", "),
            total: total,
            qr_url: qrUrl
        };

        // Use the v4 specific signature
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, {
            publicKey: EMAILJS_PUBLIC_KEY,
        });

        if (statusEl) {
            statusEl.textContent = "✅ E-ticket sent successfully to " + email;
            statusEl.className = "email-status success";
        }
        if (sendBtn) sendBtn.textContent = "✉ Resend E-Ticket";
    } catch (error) {
        console.error("EmailJS send error:", error);
        
        // Show the exact error on the screen so we can debug it
        alert("EmailJS Error: " + (error.text || error.message || JSON.stringify(error)));
        
        if (statusEl) {
            statusEl.textContent = "âŒ Could not send email. Click below to retry.";
            statusEl.className = "email-status error";
        }
    }

    if (sendBtn) sendBtn.disabled = false;
}

/* Fallback: open Gmail compose window manually */
function sendTicketByGmail() {
    const email = localStorage.getItem("cinebookEmail");

    if (!email) {
        alert("Login email not found.");
        return;
    }

    const movie = localStorage.getItem("movie") || "-";
    const theatre = localStorage.getItem("theatre") || "-";
    const screen = localStorage.getItem("screen") || "-";
    const date = localStorage.getItem("date") || "-";
    const time = localStorage.getItem("time") || "-";
    const seats = JSON.parse(localStorage.getItem("selectedSeats") || "[]");
    const bookingId = localStorage.getItem("bookingId") || "-";
    const price = Number(localStorage.getItem("price")) || 200;
    const total = calculateTotal(seats);

    const subject = "CineBook E-Ticket - " + bookingId;

    const body =
        "CINEBOOK E-TICKET\n\n" +
        "Booking ID: " + bookingId + "\n" +
        "Movie: " + movie + "\n" +
        "Theatre: " + theatre + "\n" +
        "Screen: " + screen + "\n" +
        "Date: " + date + "\n" +
        "Time: " + time + "\n" +
        "Seats: " + seats.join(", ") + "\n" +
        "Total: ₹" + total + "\n\n" +
        "Thank you for booking with CineBook!";

    const gmailURL =
        "https://mail.google.com/mail/?view=cm&fs=1" +
        "&to=" + encodeURIComponent(email) +
        "&su=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

    window.open(gmailURL, "_blank");
}

/* =========================================
   TRAILER SYSTEM
========================================= */

function openTrailer(youtubeURL) {
    const modal = document.getElementById("trailerModal");
    const frame = document.getElementById("trailerFrame");
    const youtubeButton = document.getElementById("youtubeButton");

    if (!modal || !frame || !youtubeButton) return;

    let videoId = "";

    if (youtubeURL.includes("watch?v=")) {
        videoId = youtubeURL.split("watch?v=")[1].split("&")[0];
    } else if (youtubeURL.includes("youtu.be/")) {
        videoId = youtubeURL.split("youtu.be/")[1].split("?")[0];
    } else if (youtubeURL.includes("/embed/")) {
        videoId = youtubeURL.split("/embed/")[1].split("?")[0];
    }

    if (!videoId || videoId === "YOUR_TRAILER_ID") {
        alert("Trailer link is not added for this movie yet.");
        return;
    }

    frame.src =
        "https://www.youtube-nocookie.com/embed/" +
        videoId +
        "?autoplay=1&rel=0";

    youtubeButton.href =
        "https://www.youtube.com/watch?v=" + videoId;

    modal.style.display = "flex";
}

function closeTrailer() {
    const modal = document.getElementById("trailerModal");
    const frame = document.getElementById("trailerFrame");

    if (frame) frame.src = "";
    if (modal) modal.style.display = "none";
}

document.addEventListener("click", function (event) {
    const modal = document.getElementById("trailerModal");

    if (modal && event.target === modal) {
        closeTrailer();
    }
});

/* =========================================
   UPI QR DISPLAY
========================================= */

function hideAllPaymentMethods() {
    const upi = document.getElementById("upiPayment");
    const card = document.getElementById("cardPayment");
    const netbanking = document.getElementById("netbankingPayment");
    
    if (upi) upi.style.display = "none";
    if (card) card.style.display = "none";
    if (netbanking) netbanking.style.display = "none";
}

function showUPI() {
    hideAllPaymentMethods();
    const upi = document.getElementById("upiPayment");
    if (upi) upi.style.display = "block";
}

function showCard() {
    hideAllPaymentMethods();
    const card = document.getElementById("cardPayment");
    if (card) card.style.display = "block";
}

function showNetBanking() {
    hideAllPaymentMethods();
    const netbanking = document.getElementById("netbankingPayment");
    if (netbanking) netbanking.style.display = "block";
}


/* =========================================
   CINEBOOK INTRO
========================================= */

function enterCineBook() {
    const intro = document.getElementById("cinematicIntro");

    if (intro) {
        intro.classList.add("hide");
    }
}

/* =========================================
   WALLET & REFUND SYSTEM
========================================= */

function getWalletBalance() {
    return Number(localStorage.getItem("cinebookWallet")) || 0;
}

function updateWalletBalance(amount) {
    let current = getWalletBalance();
    localStorage.setItem("cinebookWallet", current + amount);
}

function promptCancelBooking(bookingId, amount) {
    // Create modal dynamically
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "refundModal";
    modal.style.display = "flex";
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeRefundModal()">&times;</span>
            <h2>Cancel Ticket</h2>
            <p>Are you sure you want to cancel booking <b>${bookingId}</b>?</p>
            <p>Refund Amount: <b>₹${amount}</b></p>
            <h4 style="margin-top:20px; margin-bottom:10px;">Choose Refund Destination:</h4>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <button class="cart-book" style="width:100%" onclick="processRefund('${bookingId}', ${amount}, 'wallet')">CineBook Wallet (Instant)</button>
                <button class="cart-remove" style="width:100%; border:1px solid #e50914; background:transparent; color:#e50914;" onclick="processRefund('${bookingId}', ${amount}, 'bank')">Direct to Bank (24 hours)</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeRefundModal() {
    const modal = document.getElementById("refundModal");
    if (modal) modal.remove();
}

function processRefund(bookingId, amount, method) {
    let bookings = getBookings();
    
    // Find booking
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex > -1) {
        bookings[bookingIndex].status = "CANCELLED";
        saveBookings(bookings);
        
        if (method === "wallet") {
            updateWalletBalance(amount);
            alert("Ticket cancelled successfully! ₹" + amount + " has been added to your CineBook Wallet instantly.");
        } else {
            alert("Ticket cancelled successfully! ₹" + amount + " will be refunded to your bank account within 24 hours.");
        }
    }
    
    closeRefundModal();
    
    // Redirect based on refund method
    if (method === "wallet") {
        window.location.href = "wallet.html";
    } else {
        
    }
}



let walletUsedAmount = 0;

function toggleWalletUsage() {
    const isChecked = document.getElementById("useWalletCheckbox").checked;
    const balance = getWalletBalance();
    
    const seats = JSON.parse(localStorage.getItem("selectedSeats") || "[]");
    const originalTotal = calculateTotal(seats);
    
    if (isChecked) {
        if (balance >= originalTotal) {
            walletUsedAmount = originalTotal;
            document.getElementById("payTotal").innerText = "0 (Paid via Wallet)";
        } else {
            walletUsedAmount = balance;
            document.getElementById("payTotal").innerText = (originalTotal - balance) + " (₹" + balance + " from Wallet)";
        }
    } else {
        walletUsedAmount = 0;
        document.getElementById("payTotal").innerText = originalTotal;
    }
}






/* =========================================
   WALLET HEADER INJECTION
========================================= */
document.addEventListener("DOMContentLoaded", function() {
    const header = document.querySelector("header");
    if (header) {
        const bal = getWalletBalance();
        const loggedIn = localStorage.getItem("cinebookLoggedIn");
        
        if (loggedIn && bal > 0) {
            const walletDiv = document.createElement("div");
            walletDiv.id = "globalWalletDisplay";
            walletDiv.innerHTML = `<span onclick="window.location.href='wallet.html'" style="background: rgba(229, 9, 20, 0.15); border: 1px solid #e50914; padding: 5px 12px; border-radius: 20px; color: #fff; font-size: 13px; font-weight: bold; margin-right: 15px; display: inline-flex; align-items: center; gap: 5px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='rgba(229, 9, 20, 0.3)'" onmouseout="this.style.background='rgba(229, 9, 20, 0.15)'">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M22 12h-4"/></svg>
                ₹${bal}
            </span>`;
            
            // Insert before the logout button or at the end of header
            const logoutBtn = document.getElementById("logoutButton");
            if (logoutBtn) {
                header.insertBefore(walletDiv, logoutBtn);
            } else {
                header.appendChild(walletDiv);
            }
        }
    }
});




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
    const rating = document.getElementById("mRating") ? document.getElementById("mRating").value.trim() : "8.0";
    const story = document.getElementById("mStory") ? document.getElementById("mStory").value.trim() : "New highly anticipated release.";
    const category = document.getElementById("mCategory") ? document.getElementById("mCategory").value : "Now Showing";
    
    if(!title || !price || times.length === 0) {
        alert("Please fill required fields (Title, Price, Times)");
        return;
    }
    
    const addedMovies = JSON.parse(localStorage.getItem("cinebookAddedMovies")) || [];
    addedMovies.push({ title, details, trailer, price, times, image: image || "images/movie1.jpg", rating: rating || "8.0", story: story || "New highly anticipated release.", category: category });
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
        const grids = document.querySelectorAll(".movie-grid");
        const nowShowingGrid = grids[0];
        const upcomingGrid = grids[1];
        
        if(nowShowingGrid) {
            addedMovies.forEach(m => {
                const div = document.createElement("div");
                div.className = "movie-card";
                
                if (m.category === "Upcoming") {
                    div.innerHTML = `
                        <img src="${m.image}" alt="${m.title}">
                        <div class="movie-info">
                            <h3>${m.title}</h3>
                            <p>${m.details}</p>
                            <div class="release-date">Release: ${m.times.join(", ")}</div>
                            <p class="movie-story">${m.story || "New highly anticipated release."}</p>
                            <span class="coming-label">COMING SOON</span>
                            <div class="movie-buttons">
                                <button onclick="startBooking('${m.title}', ${m.price})">Pre-Book</button>
                                <button class="cart-btn" onclick="addToCart('${m.title}', ${m.price})">+ Cart</button>
                                <button class="trailer-btn" onclick="openTrailer('${m.trailer}')">Trailer</button>
                            </div>
                        </div>
                    `;
                    if (upcomingGrid) upcomingGrid.appendChild(div);
                } else {
                    div.innerHTML = `
                        <img src="${m.image}" alt="${m.title}">
                        <div class="movie-info">
                            <h3>${m.title}</h3>
                            <p>${m.details}</p>
                            <p class="movie-story">${m.story || "New highly anticipated release."}</p>
                            <span>⭐ ${m.rating || "8.0"}</span>
                            <div class="movie-buttons">
                                <button onclick="startBooking('${m.title}', ${m.price})">Book Now</button>
                                <button class="cart-btn" onclick="addToCart('${m.title}', ${m.price})">+ Cart</button>
                                <button class="trailer-btn" onclick="openTrailer('${m.trailer}')">Trailer</button>
                            </div>
                        </div>
                    `;
                    nowShowingGrid.appendChild(div);
                }
            });
        }
    } else if (currentPage === "booking.html") {
        const select = document.getElementById("movie");
        if (select) {
            const movies = getGlobalMovies();
            select.innerHTML = '<option value="">Select Movie</option>';
            movies.forEach(m => {
                const opt = document.createElement("option");
                opt.value = m.title;
                opt.innerText = m.title + (m.category === "Upcoming" ? " (Coming Soon)" : "");
                select.appendChild(opt);
            });
            
            // Restore selection if passed from home page
            const pendingMovie = localStorage.getItem("movie");
            if (pendingMovie) {
                select.value = pendingMovie;
                if (typeof populateTheatres === "function") populateTheatres();
            }
        }
    }
});
