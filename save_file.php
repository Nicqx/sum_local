<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['fileContent'])) {
  $fileContent = $_POST['fileContent'];
  $filePath = '/var/www/html/random_szam.txt';

  if (file_put_contents($filePath, $fileContent) !== false) {
    echo 'A random szám sikeresen elmentve a fájlba!';
  } else {
    echo 'Hiba történt a fájl mentése során!';
  }
}
?>

