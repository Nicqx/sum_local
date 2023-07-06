const fs = require('fs');

const randomNumber = Math.random();
const fileContent = randomNumber.toString();

fs.writeFile('/var/www/html/random_szam.txt', fileContent, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('A random szám sikeresen elmentve a /var/www/html/random_szam.txt fájlba!');
  }
});
