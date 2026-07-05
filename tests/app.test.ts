import { envs } from "../src/config/envs.ts";
import { Server } from "../src/presentation/server.ts";

vitest.mock('../src/presentation/server.ts');

describe("should call server with arguments and start", () => {

    test("should work", async () => {

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