import { envs } from "../src/config/envs.ts";
import { Server } from "../src/presentation/server.ts";

vitest.mock('../src/presentation/server.ts');

describe("debe llamar al servidos con argumentos y arrancar", () => {

    test("debe trabajar el servidor", async () => {

        await import("../src/app.ts");
        expect(Server).toHaveBeenCalledTimes(1);
        expect(Server).toHaveBeenCalledWith({
            port: envs.port,
            public_path: envs.publicPath,
            routes: expect.any(Function)
        });

        expect(Server.prototype.start).toHaveBeenCalledTimes(1)

    });
});