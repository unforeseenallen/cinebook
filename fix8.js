
const fs = require("fs");
let code = fs.readFileSync("script.js", "utf8");
code = code.replace(/ðŸ“§/g, "📧");
fs.writeFileSync("script.js", code, "utf8");

