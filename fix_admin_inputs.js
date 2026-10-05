
const fs = require("fs");
let text = fs.readFileSync("admin.html", "utf8");

text = text.replace(/\r\n/g, "\n");

const formOld = `                    <div>
                        <label>Trailer YouTube ID</label>
                        <input type="text" id="mTrailer" placeholder="e.g. 8hP9D6kZseM">
                    </div>
                    <div>
                        <label>Base Price (₹)</label>
                        <input type="number" id="mPrice" placeholder="e.g. 200">
                    </div>`;

const formNew = `                    <div>
                        <label>Trailer YouTube ID</label>
                        <input type="text" id="mTrailer" placeholder="e.g. 8hP9D6kZseM">
                    </div>
                    <div>
                        <label>Base Price (₹)</label>
                        <input type="number" id="mPrice" placeholder="e.g. 200">
                    </div>
                    <div>
                        <label>Star Rating (out of 10)</label>
                        <input type="text" id="mRating" placeholder="e.g. 8.7">
                    </div>
                    <div>
                        <label>Movie Description</label>
                        <input type="text" id="mStory" placeholder="e.g. A thrilling adventure...">
                    </div>`;

text = text.replace(formOld, formNew);
fs.writeFileSync("admin.html", text, "utf8");

