# Alapvető kép választás (Ubuntu alapú)
FROM arm64v8/ubuntu:latest

# Címkézés a szerző adataival
LABEL maintainer="Nicqx"

# Telepíti az apache2, php, git, npm és Node.js csomagokat
RUN apt-get update && \
    DEBIAN_FRONTEND="noninteractive" apt-get install -y apache2 php git npm && \
    curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Munkakönyvtár beállítása
WORKDIR /var/www/html

# Projekt klónozása a Gitből (példa)
RUN rm *
RUN git clone https://github.com/Nicqx/sum_local.git . 

# Másold be a .htaccess fájlt
COPY .htaccess /var/www/html/.htaccess

# Apache konfiguráció beállítása
RUN a2enmod rewrite

# Port megnyitása a 80-as porton
EXPOSE 80

# ToVábbi parancsok a klónozás után
RUN chmod -R 777 /var/www/html

# Indítja az Apache szervert a háttérben
CMD ["apache2ctl", "-D", "FOREGROUND"]
