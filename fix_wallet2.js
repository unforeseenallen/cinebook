
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");

text = text.replace(
    /\/\/ Reload UI if on cart page[\s\S]*?window\.location\.href = "index\.html";[\s\S]*?\}/,
    `// Redirect based on refund method
    if (method === "wallet") {
        window.location.href = "wallet.html";
    } else {
        window.location.href = "index.html";
    }`
);

fs.writeFileSync("script.js", text, "utf8");

