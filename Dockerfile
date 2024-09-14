FROM node:latest

WORKDIR /app

COPY package.json /app/

COPY yarn.lock /app/

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000

RUN yarn build

CMD ["yarn", "start", "--watch"]
