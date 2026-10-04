
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");

text = text.replace(/alert\("Login successful!"\);/g, `alert("Login successful!");
        window.location.href = "index.html";`);

fs.writeFileSync("script.js", text, "utf8");

