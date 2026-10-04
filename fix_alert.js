
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");

text = text.replace(
    `if (method === "wallet") {
            updateWalletBalance(amount);
            alert("Ticket cancelled successfully! ₹" + amount + " has been added to your CineBook Wallet instantly.");
        } else {
            alert("Ticket cancelled successfully! ₹" + amount + " will be refunded to your bank account within 24 hours.");
        }`,
    `if (method === "wallet") {
            updateWalletBalance(amount);
            // No alert to avoid blocking redirect
        } else {
            alert("Ticket cancelled successfully! ₹" + amount + " will be refunded to your bank account within 24 hours.");
        }`
);

fs.writeFileSync("script.js", text, "utf8");

