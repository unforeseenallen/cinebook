
const fs = require("fs");
let text = fs.readFileSync("admin.html", "utf8");

text = text.replace(/\r\n/g, "\n");

text = text.replace(
    `.admin-nav a {
            display: block;`,
    `.admin-nav {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .admin-nav a {
            display: block;`
);

fs.writeFileSync("admin.html", text, "utf8");

