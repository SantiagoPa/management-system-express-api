FROM node:22-alpine3.21 AS dev
WORKDIR /app
COPY package.json ./
RUN npm install -g pnpm
CMD ["pnpm", "run", "dev"]

FROM node:22-alpine3.21 AS deps-dev
WORKDIR /app
COPY package.json ./
RUN pnpm install

FROM node:22-alpine3.21 AS builder
WORKDIR /app
COPY . .
COPY --from=deps-dev /app/node_modules ./node_modules
RUN pnpm run build


FROM node:22-alpine3.21 AS prod
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/app.js"]