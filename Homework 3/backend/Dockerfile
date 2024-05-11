FROM node:20-alpine AS builder

WORKDIR /app

COPY $PWD/src /app/src
COPY $PWD/package.json /app/package.json
COPY $PWD/package-lock.json /app/package-lock.json
COPY $PWD/tsconfig.json /app/tsconfig.json

RUN npm install
RUN npm run build

FROM node:20-alpine as application

WORKDIR /app

COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json

RUN npm install --omit=dev

ENTRYPOINT ["npm", "run", "start"]
