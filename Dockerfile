FROM node:22-alpine3.21 AS dev
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
RUN npm install -g pnpm
CMD ["pnpm", "run", "dev"]

FROM node:22-alpine3.21 AS deps-dev
RUN npm install -g pnpm
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
RUN pnpm install


FROM node:22-alpine3.21 AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY . .
COPY --from=deps-dev /app/node_modules ./node_modules
RUN node -e "console.log('POSTGRES_URL:', process.env.POSTGRES_URL)"
RUN pnpm run prisma:migrate:prod
RUN pnpm run build


FROM node:22-alpine3.21 AS prod
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/app.js"]