
const fs = require("fs");
let lines = fs.readFileSync("script.js", "utf8").split("\n");
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("cancelBtnHtml = ")) {
        lines[i] = "            cancelBtnHtml = `<button class=\"cancel-ticket-btn\" onclick=\"promptCancelBooking(` + String.fromCharCode(39) + booking.id + String.fromCharCode(39) + `, ` + booking.total + `)\">Cancel</button>`;";
    }
    if (lines[i].includes("booking-price") && lines[i].includes("cancelBtnHtml")) {
        lines[i] = "            \"<div class=\`booking-price\` style=\`text-align:right;\`>₹\" + booking.total + \"<br><br>\" + cancelBtnHtml + \"</div>\";".replace(/`/g, String.fromCharCode(39));
    }
}
fs.writeFileSync("script.js", lines.join("\n"), "utf8");

