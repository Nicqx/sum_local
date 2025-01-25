FROM node:14-alpine

WORKDIR /app

# Alkalmazás fájlok másolása
COPY index.html /app/
COPY server.js /app/

# Random fájl alapértelmezett tartalommal
RUN echo "12345" > /app/random_szam.txt

# Szükséges modulok telepítése
RUN npm install express

# Port kitettsége
EXPOSE 8080

# Szerver indítása
CMD ["node", "server.js"]
