
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");

// Normalize newlines for easy replacing
text = text.replace(/\r\n/g, "\n");

// 2. Modify loginUser to detect admin
const loginOriginal = `    localStorage.setItem("cinebookLoggedIn", "true");
    localStorage.setItem("cinebookEmail", email);
    migrateLegacyAccountData(email);`;

const loginReplacement = `    localStorage.setItem("cinebookLoggedIn", "true");
    localStorage.setItem("cinebookEmail", email);
    
    // Admin Check
    if (email.toLowerCase() === "admin@cinebook.com" && password === "admin123") {
        localStorage.setItem("cinebookRole", "admin");
    } else {
        localStorage.setItem("cinebookRole", "user");
    }
    
    migrateLegacyAccountData(email);`;

text = text.replace(loginOriginal, loginReplacement);

// 3. Update redirect in loginUser to go to admin if admin
// Currently it is:
//     } else {
//         alert("Login successful!");
//         window.location.href = "index.html";
//     }
const redirectOriginal = `    } else {
        alert("Login successful!");
        window.location.href = "index.html";
    }`;

const redirectReplacement = `    } else {
        alert("Login successful!");
        if (localStorage.getItem("cinebookRole") === "admin") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "index.html";
        }
    }`;

text = text.replace(redirectOriginal, redirectReplacement);

fs.writeFileSync("script.js", text, "utf8");

