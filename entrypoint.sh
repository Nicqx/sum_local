#!/bin/sh

# Ellenőrizzük, hogy létezik-e a random_szam.txt, ha nem, akkor generáljuk
if [ ! -f /app/random_szam.txt ]; then
    echo "12345" > /app/random_szam.txt
fi

# HTTP szerver indítása
http-server -p $PORT

