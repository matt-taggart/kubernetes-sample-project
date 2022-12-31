FROM node:18-alpine

WORKDIR /app

RUN npm i -g pnpm

COPY ./package.json ./pnpm-lock.yaml  .

RUN pnpm install

COPY . .

RUN pnpm build

CMD ["pnpm", "start"] 
