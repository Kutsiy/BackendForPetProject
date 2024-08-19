
FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# RUN sh -c 'for d in /app/apps/*; do if [ -d "$d" ] && [ "$(basename "$d")" != "${APP}" ]; then rm -rf "$d"; fi; done'

CMD npm run start:dev:${APP}