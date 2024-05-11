FROM node:20-alpine

WORKDIR /app

COPY $PWD/src /app/src
COPY $PWD/package.json /app/package.json
COPY $PWD/package-lock.json /app/package-lock.json

RUN npm install --omit=dev

ENTRYPOINT ["npm", "run", "start"]
