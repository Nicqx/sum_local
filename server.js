const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;
const RANDOM_FILE = path.join(__dirname, "random_szam.txt");

// Statikus fájlok kiszolgálása
app.use(express.static(path.join(__dirname)));

// JSON és szöveges adatok fogadása
app.use(express.json());
app.use(express.text());

// Random fájl tartalmának visszaadása
app.get("/random_szam.txt", (req, res) => {
    if (fs.existsSync(RANDOM_FILE)) {
        const content = fs.readFileSync(RANDOM_FILE, "utf8");
        res.send(content);
    } else {
        res.status(404).send("random_szam.txt not found");
    }
});

// Random fájl frissítése
app.put("/random_szam.txt", (req, res) => {
    const newContent = req.body.trim();
    fs.writeFileSync(RANDOM_FILE, newContent, "utf8");
    res.send("random_szam.txt updated");
});

// Szerver indítása
app.listen(PORT, () => {
    console.log(`Szerver fut a következő porton: http://localhost:${PORT}`);
});
