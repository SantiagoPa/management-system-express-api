import { PrismaPg } from "@prisma/adapter-pg";
import { envs } from "../../config/envs.ts";
import { PrismaClient } from "../../generated/prisma/client.ts";

export const prisma = new PrismaClient({
    adapter: new PrismaPg({
        connectionString: envs.postgresUrl,
        ssl: process.env.STAGE === 'prod'
            ? { rejectUnauthorized: true }
            : false,
    }),
});
console.log("Database connected");