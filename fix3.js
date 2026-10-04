
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");
text = text.split(">?\" + booking.total").join("\" + booking.total");
text = text.split("?>?\" + booking.total").join("₹\" + booking.total");
fs.writeFileSync("script.js", text, "utf8");

