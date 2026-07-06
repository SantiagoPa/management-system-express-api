FROM node:24-alpine AS dev
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
RUN npm install -g pnpm
CMD ["pnpm", "run", "dev"]

FROM node:24-alpine AS deps-dev
RUN npm install -g pnpm
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
RUN pnpm install


FROM node:24-alpine AS tests
WORKDIR /app
RUN npm install -g pnpm
RUN npm install -g dotenv-cli
COPY . .
COPY --from=deps-dev /app/node_modules ./node_modules
RUN pnpm exec prisma generate
RUN pnpm runt test

FROM node:24-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY . .
COPY --from=deps-dev /app/node_modules ./node_modules
RUN pnpm exec prisma generate
RUN pnpm run build


FROM node:24-alpine AS prod
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["sh", "-c", "node dist/app.js"]