# Alap kép: egy egyszerű Node.js alapú webszerver
FROM node:14-alpine

# Alkalmazás könyvtár létrehozása
WORKDIR /app

# HTML fájlok másolása az alkalmazás könyvtárba
COPY index.html /app/

# Egyszerű webszerver telepítése és indítása
RUN npm install -g http-server

# Alapértelmezett port
ENV PORT 8080

# Port kitettsége
EXPOSE $PORT

# Webszerver indítása
CMD ["http-server", "-p", "8080"]
