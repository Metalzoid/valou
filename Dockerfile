FROM node:20.15.1-slim

WORKDIR /app

ENV NODE_ENV=production

COPY . .
RUN yarn install
RUN yarn build

EXPOSE 80
CMD ["node", ".output/server/index.mjs"]
