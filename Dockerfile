FROM node:12.14

COPY ./client /usr/src/app/client

COPY ./server /usr/src/app/server

WORKDIR /usr/src/app/client

RUN yarn install

RUN yarn run build

WORKDIR /usr/src/app/server

RUN yarn install

EXPOSE 80

CMD [ "node", "index.js"]