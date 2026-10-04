
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");

const brokenModalStart = `modal.innerHTML = '
        <div class="modal-content">`;
const brokenModalEnd = `        </div>
    ';`;

const correctModal = `modal.innerHTML = \`
        <div class="modal-content">
            <span class="close" onclick="closeRefundModal()">&times;</span>
            <h2>Cancel Ticket</h2>
            <p>Are you sure you want to cancel booking <b>\${bookingId}</b>?</p>
            <p>Refund Amount: <b>₹\${amount}</b></p>
            <h4 style="margin-top:20px; margin-bottom:10px;">Choose Refund Destination:</h4>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <button class="cart-book" style="width:100%" onclick="processRefund('\${bookingId}', \${amount}, 'wallet')">CineBook Wallet (Instant)</button>
                <button class="cart-remove" style="width:100%; border:1px solid #e50914; background:transparent; color:#e50914;" onclick="processRefund('\${bookingId}', \${amount}, 'bank')">Direct to Bank (24 hours)</button>
            </div>
        </div>
    \`;`;

let startIndex = text.indexOf(`modal.innerHTML = '`);
let endIndex = text.indexOf(`    ';`, startIndex) + 7;

if (startIndex !== -1 && endIndex !== -1) {
    let before = text.substring(0, startIndex);
    let after = text.substring(endIndex);
    text = before + correctModal.replace(/'/g, String.fromCharCode(39)) + after;
    
    // Also fix the ?${bal} in walletDiv
    text = text.replace("?${bal}", "₹${bal}");
    
    fs.writeFileSync("script.js", text, "utf8");
    console.log("Fixed!");
} else {
    console.log("Not found", startIndex, endIndex);
}

