FROM node:20.15.1

WORKDIR /app

COPY package*.json ./

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000

RUN yarn build

CMD ["node", ".output/server/index.mjs"]
