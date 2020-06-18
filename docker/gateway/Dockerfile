# STAGE 1: Prepare builder
FROM node:14-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn run build:gateway

# STAGE 2: Run
FROM node:14-alpine as runtime

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./

RUN yarn install --production=true --frozen-lockfile

ENV GATEWAY_PORT="4000"

ENV HEROES_SERVICE_HOST=heroes-service
ENV HEROES_SERVICE_PORT="4001"

ENV TEAMS_SERVICE_HOST=teams-service
ENV TEAMS_SERVICE_PORT="4002"

COPY --from=builder /app/dist/apps/gateway ./

CMD ["node", "main.js"]
