import { envs } from "./config/envs.ts";
import { AppRoutes } from "./presentation/routes.ts";
import { Server } from "./presentation/server.ts";


(async () => {
    main();
})();

function main() {

    const server = new Server({
        port: envs.port,
        public_path: envs.publicPath,
        routes: AppRoutes.routes,
    });
    server.start();
}