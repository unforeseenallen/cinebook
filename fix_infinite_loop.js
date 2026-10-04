
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");

text = text.replace(
    `function saveBookings(bookings) {
    saveBookings(bookings);`,
    `function saveBookings(bookings) {
    localStorage.setItem(accountStorageKey("cinebookBookings"), JSON.stringify(bookings));`
);

fs.writeFileSync("script.js", text, "utf8");

