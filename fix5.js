
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");
text = text.replace("style='text-align:right;'>?\" + booking.total", "style='text-align:right;'>₹\" + booking.total");
text = text.replace("style=\`text-align:right;\`>?\" + booking.total", "style=\`text-align:right;\`>₹\" + booking.total");
text = text.replace("style='text-align:right;'>₹\" + booking.total", "style='text-align:right;'>₹\" + booking.total");
text = text.replace("<div class='booking-price' style='text-align:right;'>?\" + booking.total", "<div class='booking-price' style='text-align:right;'>₹\" + booking.total");
text = text.replace("<div class=\`booking-price\` style=\`text-align:right;\`>?", "<div class=\`booking-price\` style=\`text-align:right;\`>₹");
fs.writeFileSync("script.js", text.replace(/`/g, String.fromCharCode(39)), "utf8");

