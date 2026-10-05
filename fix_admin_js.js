
const fs = require("fs");
let text = fs.readFileSync("script.js", "utf8");
text = text.replace(/\r\n/g, "\n");

const addOld = "    const trailer = document.getElementById(\"mTrailer\").value.trim();\n    const price = Number(document.getElementById(\"mPrice\").value);\n    const times = document.getElementById(\"mTimes\").value.split(\",\").map(t => t.trim());\n    const image = document.getElementById(\"mImage\").value.trim();\n    \n    if(!title || !price || times.length === 0) {\n        alert(\"Please fill required fields (Title, Price, Times)\");\n        return;\n    }\n    \n    const addedMovies = JSON.parse(localStorage.getItem(\"cinebookAddedMovies\")) || [];\n    addedMovies.push({ title, details, trailer, price, times, image: image || \"images/movie1.jpg\" });";

const addNew = "    const trailer = document.getElementById(\"mTrailer\").value.trim();\n    const price = Number(document.getElementById(\"mPrice\").value);\n    const times = document.getElementById(\"mTimes\").value.split(\",\").map(t => t.trim());\n    const image = document.getElementById(\"mImage\").value.trim();\n    const rating = document.getElementById(\"mRating\") ? document.getElementById(\"mRating\").value.trim() : \"8.0\";\n    const story = document.getElementById(\"mStory\") ? document.getElementById(\"mStory\").value.trim() : \"New highly anticipated release.\";\n    \n    if(!title || !price || times.length === 0) {\n        alert(\"Please fill required fields (Title, Price, Times)\");\n        return;\n    }\n    \n    const addedMovies = JSON.parse(localStorage.getItem(\"cinebookAddedMovies\")) || [];\n    addedMovies.push({ title, details, trailer, price, times, image: image || \"images/movie1.jpg\", rating: rating || \"8.0\", story: story || \"New highly anticipated release.\" });";

text = text.replace(addOld, addNew);

const renderOld = "                        <p>${m.details}</p>\n                        <p class=\"movie-story\">New highly anticipated release.</p>\n                        <div class=\"movie-buttons\">";
const renderNew = "                        <p>${m.details}</p>\n                        <p class=\"movie-story\">${m.story || \"New highly anticipated release.\"}</p>\n                        <span>⭐ ${m.rating || \"8.0\"}</span>\n                        <div class=\"movie-buttons\">";

text = text.replace(renderOld, renderNew);

fs.writeFileSync("script.js", text, "utf8");

