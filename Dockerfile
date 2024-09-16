FROM node:20.15.1-slim

WORKDIR /app

ENV NODE_ENV=production
ENV API_BASE_URL="fake"
ENV ADMIN_API_KEY="fake"

COPY . .
RUN yarn install
RUN yarn build

EXPOSE 80
CMD ["node", ".output/server/index.mjs"]
