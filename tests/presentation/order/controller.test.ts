import { OrderController } from "../../../src/presentation/order/controller.ts";
import type { OrderRepository } from "../../../src/domain/index.ts";

describe("OrderController", () => {

    const mockRepository = {} as OrderRepository;
    const controller = new OrderController(mockRepository);

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("should be an instance of OrderController", () => {
        expect(controller).toBeInstanceOf(OrderController);
    });

    it("should expose 2 public methods (createOrder, updateStatusOrder)", () => {
        const publicMethods = ["createOrder", "updateStatusOrder"];
        expect(publicMethods).toHaveLength(2);
        publicMethods.forEach(method => {
            expect(controller).toHaveProperty(method);
            expect(typeof (controller as any)[method]).toBe("function");
        });
    });

});
