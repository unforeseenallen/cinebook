
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");

// Make header pill clickable
text = text.replace(
    `<span style="background: rgba(229, 9, 20, 0.15); border: 1px solid #e50914; padding: 5px 12px; border-radius: 20px; color: #fff; font-size: 13px; font-weight: bold; margin-right: 15px; display: inline-flex; align-items: center; gap: 5px;">`,
    `<span onclick="window.location.href='wallet.html'" style="background: rgba(229, 9, 20, 0.15); border: 1px solid #e50914; padding: 5px 12px; border-radius: 20px; color: #fff; font-size: 13px; font-weight: bold; margin-right: 15px; display: inline-flex; align-items: center; gap: 5px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='rgba(229, 9, 20, 0.3)'" onmouseout="this.style.background='rgba(229, 9, 20, 0.15)'">`
);

// Modify processRefund redirect logic
const oldRedirect = `    // Reload UI if on cart page
    if (document.getElementById("bookingsList")) {
        window.location.href = "index.html";
    }`;
const newRedirect = `    // Redirect based on refund method
    if (method === "wallet") {
        window.location.href = "wallet.html";
    } else {
        window.location.href = "index.html";
    }`;

text = text.replace(oldRedirect, newRedirect);

fs.writeFileSync("script.js", text, "utf8");

