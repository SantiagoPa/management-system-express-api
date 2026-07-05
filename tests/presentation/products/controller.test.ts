import { ProductsController } from "../../../src/presentation/products/controller.ts";
import type { ProductRepository } from "../../../src/domain/index.ts";

describe("ProductsController", () => {

    const mockRepository = {} as ProductRepository;
    const controller = new ProductsController(mockRepository);

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("should be an instance of ProductsController", () => {
        expect(controller).toBeInstanceOf(ProductsController);
    });

    it("should expose 5 public methods (getProducts, getProductById, createProduct, seedProducts, inventoryAdjustment)", () => {
        const publicMethods = [
            "getProducts",
            "getProductById",
            "createProduct",
            "seedProducts",
            "inventoryAdjustment",
        ];
        expect(publicMethods).toHaveLength(5);
        publicMethods.forEach(method => {
            expect(controller).toHaveProperty(method);
            expect(typeof (controller as any)[method]).toBe("function");
        });
    });

});
