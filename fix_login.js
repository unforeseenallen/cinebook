
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");

text = text.replace(
`    } else {
        alert("Login successful!");
    }`,
`    } else {
        alert("Login successful!");
        if (window.location.pathname.indexOf("login.html") > -1 || window.location.pathname.endsWith("/")) {
            window.location.href = "index.html";
        }
    }`
);

fs.writeFileSync("script.js", text, "utf8");

