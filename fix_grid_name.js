
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");

text = text.replace(
    `const grid = document.querySelector(".movies-grid");`,
    `const grid = document.querySelector(".movie-grid");`
);

fs.writeFileSync("script.js", text, "utf8");

