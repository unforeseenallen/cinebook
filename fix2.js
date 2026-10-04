
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");
text = text.split("?${amount}").join("₹${amount}");
text = text.split("?" + " + amount").join("₹" + " + amount");
text = text.split("(?" + " + balance").join("(₹" + " + balance");
fs.writeFileSync("script.js", text, "utf8");

