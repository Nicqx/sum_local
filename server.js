const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 8080;

app.use(express.static("public"));
app.use(express.json());

// Olvassuk be és küldjük vissza a `random_szam.txt` tartalmát
app.get("/random_szam.txt", (req, res) => {
    fs.readFile(path.join(__dirname, "public", "random_szam.txt"), "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Hiba a fájl olvasásakor");
        }
        res.send(data);
    });
});

// Engedjük meg a fájl módosítását
app.put("/random_szam.txt", (req, res) => {
    const newRandom = Math.floor(Math.random() * 1000000).toString();
    fs.writeFile(path.join(__dirname, "public", "random_szam.txt"), newRandom, (err) => {
        if (err) {
            return res.status(500).send("Hiba a fájl írásakor");
        }
        res.send("Új random szám: " + newRandom);
    });
});

app.listen(PORT, () => {
    console.log(`Szerver fut: http://localhost:${PORT}`);
});
