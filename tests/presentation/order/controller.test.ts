import { OrderController } from "../../../src/presentation/order/controller.ts";
import type { OrderRepository } from "../../../src/domain/index.ts";

describe("OrderController", () => {

    const mockRepository = {} as OrderRepository;
    const controller = new OrderController(mockRepository);

    it("debe estar definido", () => {
        expect(controller).toBeDefined();
    });

    it("debe ser una instancia de OrderController", () => {
        expect(controller).toBeInstanceOf(OrderController);
    });

    it("debe exponer dos métodos públicos (createOrder, updateStatusOrder)", () => {
        const publicMethods = ["createOrder", "updateStatusOrder"];
        expect(publicMethods).toHaveLength(2);
        publicMethods.forEach(method => {
            expect(controller).toHaveProperty(method);
            expect(typeof (controller as any)[method]).toBe("function");
        });
    });

});