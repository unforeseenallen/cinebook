
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");
text = text.replace("successfully! ?\" + amount", "successfully! ₹\" + amount");
text = text.replace("successfully! ?\" + amount", "successfully! ₹\" + amount");
fs.writeFileSync("script.js", text, "utf8");

