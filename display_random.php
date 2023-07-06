<?php
$filePath = '/var/www/html/random_szam.txt';
if (file_exists($filePath)) {
  $fileContent = file_get_contents($filePath);
  echo 'A random szám tartalma: ' . $fileContent;
} else {
  echo 'A fájl nem található.';
}
?>

