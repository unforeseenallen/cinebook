
const fs = require("fs");
let code = fs.readFileSync("script.js", "utf8");

code = code.replace(/â”€â”€ Automatically send the e-ticket email â”€â”€/g, "── Automatically send the e-ticket email ──");
code = code.replace(/âš  Cannot send â€” missing email or booking./g, "⚠️ Cannot send — missing email or booking.");
code = code.replace(/â Œ Could not send email/g, "❌ Could not send email");

fs.writeFileSync("script.js", code, "utf8");

