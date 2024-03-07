const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const route =require("./routes/index")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// modularized(put in separate files) the api routes
//http://localhost:3001
app.use("/api",route)

app.get("api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Route to serve the index.html file for all other GET requests
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Start the server
app.listen(PORT, () => {
    console.log(`App is listening at PORT: http://localhost:${PORT}`);
});
