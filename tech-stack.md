# CineBook: Project Architecture & Features

This document outlines all the technologies, APIs, and features that have been implemented in the CineBook project up to this point.

## 🛠️ Core Technologies
Since this project is designed to run seamlessly on free hosting tiers (like Render and GitHub Pages) without needing a complex backend database, it relies on a modern frontend architecture:

* **HTML5, CSS3, JavaScript (Vanilla):** The core languages powering the structure, design, and logic of the website.
* **Local Storage (Browser Database):** Used as a lightweight, lightning-fast database to store user accounts, cart items, confirmed bookings, and wallet balances without needing a backend server like MongoDB.
* **Node.js (Optional):** Included in `server.js` for local testing, but the app is fully capable of running purely on the frontend.

## 🔌 Third-Party APIs & Libraries
* **EmailJS:** Used to securely send E-Ticket confirmation emails directly from the frontend. This bypasses Render's strict email-blocking policies on free tiers.
* **QuickChart API:** Generates the dynamic QR codes you see on the E-Tickets and the UPI payment screens.
* **Google Fonts:** Uses the *Poppins* font family for a modern, sleek, and premium typographic feel.

## ✨ Key Features Built

### 1. User System & Wallet
* **Account Management:** Users can register, log in, and stay logged in across sessions.
* **CineBook Wallet:** A digital wallet system where users can store money. The balance is globally displayed in a premium glowing pill in the website header.
* **Wallet Payments:** Users can use their wallet balance to partially or fully pay for new tickets on the payment page.

### 2. Movie & Showtime Selection
* **Dynamic Movie Catalog:** Browse movies, view details, and watch YouTube trailers in a custom popup modal.
* **Showtime Booking:** Select specific dates and showtimes for the chosen movie.

### 3. Premium Seating Engine
* **BookMyShow Layout:** A highly customized seating grid featuring distinct rows (A through K) and premium categories.
* **Dynamic Pricing:** 
  * Recliner Rows (₹280)
  * Prime Rows (₹170)
  * Extra Legroom (₹200)
  * Classic Plus (₹150)
  * Classic (₹105)
* **Best Seats Highlight:** The absolute best seats in the house (center of Prime & Legroom rows) feature a pulsing white/red cinematic glow.
* **Seat States:** Interactive seats that toggle between Available (Grey), Selected (Red), and Occupied (Dark).

### 4. Cart & Cancellation System
* **Shopping Cart:** Add unconfirmed tickets to a cart to pay for them later.
* **Ticket Cancellation:** Users can cancel confirmed tickets from their cart page.
* **Refund Routing:** When cancelling, users choose between an instant refund to their CineBook Wallet or a 24-hour refund to their bank.

### 5. Payments & E-Tickets
* **Multiple Payment Methods:** Supports simulated UPI (with dynamic QR code), Credit/Debit Card, and Net Banking forms.
* **Dynamic E-Tickets:** Generates a visually appealing digital ticket containing a unique Booking ID (e.g., CB123456), movie details, selected seats, and a scannable QR code.
* **Email Automation:** Automatically emails the final E-Ticket to the user's registered email address upon successful payment.
