// Random szám generálása és mentése a random_szam.txt fájlba
async function updateRandomFile() {
    try {
        const randomNumber = Math.floor(Math.random() * 1000000); // Új random szám
        const response = await fetch("/random_szam.txt", {
            method: "PUT",
            headers: { "Content-Type": "text/plain" },
            body: randomNumber.toString(),
        });

        if (response.ok) {
            console.log("Random szám frissítve:", randomNumber);
            loadPuzzle(); // Új puzzle betöltése
        } else {
            console.error("Hiba a random fájl frissítésénél:", response.status);
        }
    } catch (error) {
        console.error("Hiba a random szám generálásakor:", error);
    }
}
