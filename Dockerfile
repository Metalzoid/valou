FROM node:latest

WORKDIR /app

COPY ./package.json yarn.lock ./
COPY ./package.json yarn.lock /app/

RUN yarn install

COPY . /app

RUN yarn run build

CMD ["node", ".output/server/index.mjs"]
