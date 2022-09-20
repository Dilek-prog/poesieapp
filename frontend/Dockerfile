FROM node
WORKDIR /usr/app
COPY public /usr/app/public
COPY index.js /usr/app/index.js
COPY package.json /usr/app/package.json
COPY package-lock.json /usr/app/package-lock.json

EXPOSE 8080

RUN npm install
