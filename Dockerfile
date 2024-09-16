FROM node:20.15.1-slim

WORKDIR /app

ARG ADMIN_API_KEY
ARG API_BASE_URL

ENV NODE_ENV=production
ENV API_BASE_URL=$API_URL
ENV ADMIN_API_KEY=$ADMIN_API_KEY

COPY . .
RUN yarn install --production=false
RUN yarn build

EXPOSE 80
CMD ["node", ".output/server/index.mjs"]
