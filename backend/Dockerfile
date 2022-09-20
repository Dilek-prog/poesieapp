FROM node
WORKDIR /usr/app
COPY middleware /usr/app/middleware
COPY models /usr/app/models
COPY routes /usr/app/routes
COPY server.js /usr/app/server.js
COPY .env /usr/app/.env
COPY package.json /usr/app/package.json
COPY package-lock.json /usr/app/package-lock.json

EXPOSE 3000

RUN npm install