FROM node:12.14

WORKDIR /usr/src/app

COPY  ./client/build ./client/build

COPY ./server/ ./server

WORKDIR /usr/src/app/server

RUN yarn install

EXPOSE 80

CMD [ "node", "index.js"]