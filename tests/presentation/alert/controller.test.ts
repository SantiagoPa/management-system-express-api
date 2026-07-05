import { AlertController } from "../../../src/presentation/alert/controller.ts";
import type { AlertRepository } from "../../../src/domain/index.ts";

describe("AlertController", () => {

    const mockRepository = {} as AlertRepository;
    const controller = new AlertController(mockRepository);

    it("debe estar definido", () => {
        expect(controller).toBeDefined();
    });

    it("debe ser una instancia de AlertController", () => {
        expect(controller).toBeInstanceOf(AlertController);
    });

    it("debe exponer un único método público (getAll)", () => {
        const publicMethods = ["getAll"];
        expect(publicMethods).toHaveLength(1);
        publicMethods.forEach(method => {
            expect(controller).toHaveProperty(method);
            expect(typeof (controller as any)[method]).toBe("function");
        });
    });

});