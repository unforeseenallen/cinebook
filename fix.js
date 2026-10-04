
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");

text = text.replace(/>\?" \+ booking.total/g, "\" + booking.total");
text = text.replace(/\?>\?" \+ booking.total/g, "₹\" + booking.total");
text = text.replace(/\?\$\{amount\}/g, "₹${amount}");
text = text.replace(/\?" \+ amount/g, "₹\" + amount");
text = text.replace(/\(\?" \+ balance/g, "(₹\" + balance");

text = text.replace(/window\.location\.href = "index\.html";/g, "");
text = text.replace(/loadCart\(\);/g, "window.location.href = \"index.html\";");
text = text.replace("processRefund('${bookingId}', ${amount}, 'wallet')", "processRefund(`${bookingId}`, ${amount}, `wallet`)");
text = text.replace("processRefund('${bookingId}', ${amount}, 'bank')", "processRefund(`${bookingId}`, ${amount}, `bank`)");

fs.writeFileSync("script.js", text, "utf8");

