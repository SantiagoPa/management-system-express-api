import { envs } from "../src/config/envs.ts";
import { AppRoutes } from "../src/presentation/routes.ts";
import { Server } from "../src/presentation/server.ts";

export const testServer = new Server({
    port: envs.port,
    routes: AppRoutes.routes
})