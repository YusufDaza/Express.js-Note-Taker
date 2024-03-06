const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const route =require("./routes")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// modularized(put in separate files) the api routes
//http://localhost:3001
app.use("/api"route)

app.get("api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Route to serve the index.html file for all other GET requests
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//html routes stay in server.js unmodularized
app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const notes = JSON.parse(data);
        res.json(notes);
    });
});

// Route to receive a new note and save it
app.post("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const notes = JSON.parse(data);
        const newNote = req.body;
        newNote.id = uuidv4(); // Assign a unique id using uuidv4

        notes.push(newNote);

        fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json(newNote);
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`App is listening at PORT: http://localhost:${PORT}`);
});
