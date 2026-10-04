
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");

text = text.replace(/\\`/g, "`");
text = text.replace(/\\\$/g, "$");

fs.writeFileSync("script.js", text, "utf8");

