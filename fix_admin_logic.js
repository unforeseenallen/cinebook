
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");

// 1. Update Login protection to allow admin.html
text = text.replace(
    `const isLoginPage = currentPage === "login.html" || currentPage === ""; // Wait, index.html is sometimes ""`,
    `const isLoginPage = currentPage === "login.html" || currentPage === "";
    
    // Protect Admin Page
    if (currentPage === "admin.html" && localStorage.getItem("cinebookRole") !== "admin") {
        window.location.href = "login.html";
    }`
);

// 2. Modify loginUser to detect admin
const loginReplacement = `    localStorage.setItem("cinebookLoggedIn", "true");
    localStorage.setItem("cinebookEmail", email);
    
    // Admin Check
    if (email.toLowerCase() === "admin@cinebook.com" && password === "admin123") {
        localStorage.setItem("cinebookRole", "admin");
    } else {
        localStorage.setItem("cinebookRole", "user");
    }
    
    migrateLegacyAccountData(email);`;
text = text.replace(`    localStorage.setItem("cinebookLoggedIn", "true");
    localStorage.setItem("cinebookEmail", email);
    migrateLegacyAccountData(email);`, loginReplacement);

// 3. Update redirect in loginUser to go to admin if admin
text = text.replace(`window.location.href = "index.html";`, `if (localStorage.getItem("cinebookRole") === "admin") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "index.html";
        }`);

// 4. Update saveBookings to also save to global bookings
const saveBookingsLogic = `function saveBookings(bookings) {
    const email = localStorage.getItem("cinebookEmail");
    if (email) {
        localStorage.setItem("cinebookBookings_" + email, JSON.stringify(bookings));
        
        // Update global bookings
        let globalBookings = JSON.parse(localStorage.getItem("cinebookGlobalBookings")) || [];
        // We need to merge them so we don't duplicate, but the easiest way is to push new ones in completePayment, 
        // or update statuses here.
        bookings.forEach(b => {
            const idx = globalBookings.findIndex(gb => gb.id === b.id);
            if (idx > -1) {
                globalBookings[idx] = b; // Update status if cancelled
            } else {
                b.email = email; // Attach email for admin tracking
                globalBookings.push(b);
            }
        });
        localStorage.setItem("cinebookGlobalBookings", JSON.stringify(globalBookings));
    }
}`;
// We need to replace the entire saveBookings function
text = text.replace(/function saveBookings\(bookings\) \{[\s\S]*?\}/, saveBookingsLogic);


fs.writeFileSync("script.js", text, "utf8");

