
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");
text = text.replace(/<span>\? \$\{m.rating/g, "<span>" + String.fromCodePoint(0x2B50) + " ${m.rating");
fs.writeFileSync("script.js", text, "utf8");

