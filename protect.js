
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");

const protectionCode = `
/* =========================================
   LOGIN GATE PROTECTION
========================================= */
(function() {
    const isLoggedIn = localStorage.getItem("cinebookLoggedIn") === "true";
    const currentPage = window.location.pathname.split("/").pop();
    
    // Pages that don't require redirecting TO login (i.e. already login page)
    const isLoginPage = currentPage === "login.html" || currentPage === ""; // Wait, index.html is sometimes ""
    
    if (!isLoggedIn && currentPage !== "login.html") {
        window.location.href = "login.html";
    } else if (isLoggedIn && currentPage === "login.html") {
        window.location.href = "index.html";
    }
})();
`;

// Insert at the top
text = protectionCode.replace(/'/g, String.fromCharCode(39)) + "\n" + text;

// Change loginUser success behavior to redirect to index.html if on login page
text = text.replace(`    } else {
        alert("Login successful!");
    }`, `    } else {
        if (window.location.pathname.indexOf("login.html") > -1) {
            window.location.href = "index.html";
        } else {
            alert("Login successful!");
        }
    }`);

// Also update logout function to redirect to login.html
text = text.replace(`function logoutUser() {
    localStorage.removeItem("cinebookLoggedIn");
    updateLoginGreeting();
}`, `function logoutUser() {
    localStorage.removeItem("cinebookLoggedIn");
    window.location.href = "login.html";
}`);

fs.writeFileSync("script.js", text, "utf8");

