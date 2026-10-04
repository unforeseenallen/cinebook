
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");

text = text.replace(/\r\n/g, "\n");

const oldCode = `    // UPI is selected by default.
    showUPI();
}`;

const newCode = `    // Wallet Section Logic
    const bal = getWalletBalance();
    if (bal > 0) {
        const wSec = document.getElementById("walletSection");
        const wBal = document.getElementById("walletBalanceDisplay");
        if (wSec && wBal) {
            wSec.style.display = "block";
            wBal.innerText = bal;
        }
    }

    // UPI is selected by default.
    showUPI();
}`;

text = text.replace(oldCode, newCode);

fs.writeFileSync("script.js", text, "utf8");

