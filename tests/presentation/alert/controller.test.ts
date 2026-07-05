import { AlertController } from "../../../src/presentation/alert/controller.ts";
import type { AlertRepository } from "../../../src/domain/index.ts";

describe("AlertController", () => {

    const mockRepository = {} as AlertRepository;
    const controller = new AlertController(mockRepository);

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("should be an instance of AlertController", () => {
        expect(controller).toBeInstanceOf(AlertController);
    });

    it("should expose 1 public method (getAll)", () => {
        const publicMethods = ["getAll"];
        expect(publicMethods).toHaveLength(1);
        publicMethods.forEach(method => {
            expect(controller).toHaveProperty(method);
            expect(typeof (controller as any)[method]).toBe("function");
        });
    });

});
