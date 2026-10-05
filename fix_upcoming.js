
const fs = require("fs");
let text = fs.readFileSync("admin.html", "utf8");
text = text.replace(/\r\n/g, "\n");

const formOld = `<div class="full-width">
                        <label>Showtimes (Comma separated)</label>
                        <input type="text" id="mTimes" placeholder="e.g. 10:00 AM, 01:30 PM, 06:00 PM">
                    </div>`;

const formNew = `                    <div>
                        <label>Category</label>
                        <select id="mCategory" style="width:100%; padding:12px; background:#222; border:1px solid #444; border-radius:6px; color:#fff;">
                            <option value="Now Showing">Now Showing</option>
                            <option value="Upcoming">Upcoming (Coming Soon)</option>
                        </select>
                    </div>
                    <div>
                        <label>Showtimes OR Release Date</label>
                        <input type="text" id="mTimes" placeholder="e.g. 10:00 AM OR 25 Dec 2026">
                    </div>`;

text = text.replace(formOld, formNew);

const tableOld = `<th>Price</th>
                            <th>Showtimes</th>
                            <th>Action</th>`;
const tableNew = `<th>Price</th>
                            <th>Category</th>
                            <th>Action</th>`;
text = text.replace(tableOld, tableNew);

fs.writeFileSync("admin.html", text, "utf8");

