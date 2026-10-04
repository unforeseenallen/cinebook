
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");

const globalBookingsLogic = `
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
`;

// Insert it right after getBookings
text = text.replace(/function getBookings\(\) \{[\s\S]*?catch \(error\) \{\s*return \[\];\s*\}\s*\}/, match => match + "\n\n" + globalBookingsLogic);

// We need to also hook up the completePayment to push to globalBookings
// But wait! If completePayment calls localStorage.setItem(accountStorageKey("cinebookBookings"), JSON.stringify(bookings)), we can just replace that line with saveBookings(bookings)!
text = text.replace(/localStorage\.setItem\(accountStorageKey\("cinebookBookings"\), JSON\.stringify\(bookings\)\);/g, "saveBookings(bookings);");

fs.writeFileSync("script.js", text, "utf8");

