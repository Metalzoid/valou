FROM node:18

WORKDIR /app

COPY package.json /app

RUN yarn install
COPY . /app

RUN yarn run build

CMD ["yarn", "run", "start"]
