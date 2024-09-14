FROM node:18

WORKDIR /app

COPY package.json yarn.lock ./
COPY package.json yarn.lock /app/

RUN yarn install

COPY . /app

RUN yarn run build

CMD ["yarn", "run", "start"]
