
const fs = require("fs");
let text = fs.readFileSync("admin.html", "utf8");

// Remove the slashes in front of backticks and dollar signs
text = text.replace(/\\`/g, "`");
text = text.replace(/\\\$/g, "$");

fs.writeFileSync("admin.html", text, "utf8");

