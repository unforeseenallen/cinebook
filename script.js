/* =========================================
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
    window.location.href = "index.html";
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
    loadCart();
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
    }).slice(0, 5).forEach(function (booking) {
        const card = document.createElement("article");
        card.className = "confirmed-booking";
        card.innerHTML =
            "<div><span class='booking-status'>CONFIRMED</span><h3></h3><p class='booking-meta'></p></div>" +
            "<div class='booking-price'></div>";
        card.querySelector("h3").textContent = booking.movie;
        card.querySelector(".booking-meta").textContent =
            booking.theatre + " · " + booking.date + " · " + booking.time +
            " · Seats: " + booking.seats.join(", ") + " · " + booking.id;
        card.querySelector(".booking-price").textContent = "₹" + booking.total;
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
   CREATE SEATS
========================================= */

function createSeats() {
    const container = document.getElementById("seats");
    if (!container) return;

    container.innerHTML = "";

    const screen = localStorage.getItem("screen");
    let occupied = [];

    if (screen === "Screen 1") {
        occupied = [3, 7, 12, 18, 24, 31, 36, 45];
    } else if (screen === "Screen 2") {
        occupied = [2, 5, 11, 17, 22, 29, 34, 41, 48];
    } else if (screen === "Screen 3") {
        occupied = [4, 9, 15, 20, 27, 32, 39, 44];
    } else {
        occupied = [1, 6, 13, 19, 25, 33, 38, 47];
    }

    for (let i = 1; i <= 60; i++) {
        const seat = document.createElement("div");
        seat.classList.add("seat");
        seat.innerText = i;
        seat.dataset.seat = i;

        if (occupied.includes(i)) {
            seat.classList.add("occupied-seat");
        }

        seat.addEventListener("click", function () {
            if (seat.classList.contains("occupied-seat")) return;

            seat.classList.toggle("selected-seat");
            updateSeats();
        });

        container.appendChild(seat);
    }

    // Restore selections if user returns to this page.
    const savedSeats = JSON.parse(localStorage.getItem("selectedSeats") || "[]");

    savedSeats.forEach(function (seatNumber) {
        const seat = container.querySelector('[data-seat="' + seatNumber + '"]');
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
    const total = seats.length * price;

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
    const total = seats.length * price;

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

    // UPI is selected by default.
    showUPI();
}

function getPaymentRequestLink() {
    const seats = JSON.parse(localStorage.getItem("selectedSeats") || "[]");
    const price = Number(localStorage.getItem("price")) || 200;
    const total = seats.length * price;
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
    localStorage.setItem("paymentMethod", payment.value);
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
        total: seats.length * (Number(localStorage.getItem("price")) || 200),
        paymentMethod: payment.value,
        bookedAt: new Date().toISOString()
    });
    localStorage.setItem(accountStorageKey("cinebookBookings"), JSON.stringify(bookings));

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
    const total = seats.length * price;

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
        if (statusEl) statusEl.textContent = "⚠ Cannot send — missing email or booking.";
        return;
    }

    const movie = localStorage.getItem("movie") || "-";
    const theatre = localStorage.getItem("theatre") || "-";
    const screen = localStorage.getItem("screen") || "-";
    const date = localStorage.getItem("date") || "-";
    const time = localStorage.getItem("time") || "-";
    const seats = JSON.parse(localStorage.getItem("selectedSeats") || "[]");
    const price = Number(localStorage.getItem("price")) || 200;
    const total = seats.length * price;

    // Show sending state
    if (statusEl) {
        statusEl.textContent = "📧 Sending e-ticket to " + email + "...";
        statusEl.className = "email-status sending";
    }
    if (sendBtn) sendBtn.disabled = true;

    // Generate QR Code URL
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
    const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(qrData);

    try {
        // REPLACE THESE 3 VALUES WITH YOUR EMAILJS KEYS
        const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
        const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
        const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

        emailjs.init(EMAILJS_PUBLIC_KEY);

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

        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

        if (statusEl) {
            statusEl.textContent = "✅ E-ticket sent successfully to " + email;
            statusEl.className = "email-status success";
        }
        if (sendBtn) sendBtn.textContent = "✉ Resend E-Ticket";
    } catch (error) {
        console.error("EmailJS send error:", error);
        if (statusEl) {
            statusEl.textContent = "❌ Could not send email. Click below to retry.";
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
    const total = seats.length * price;

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

function showUPI() {
    const upi = document.getElementById("upiPayment");
    if (upi) upi.style.display = "block";
}

function hideUPI() {
    const upi = document.getElementById("upiPayment");
    if (upi) upi.style.display = "none";
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
