import { Router } from "express";
import { ProductsController } from "./controller.ts";
import { ProductDatasourceImpl } from "../../infrastructure/datasource/product.datasource.impl.ts";
import { ProductRepositoryImpl } from "../../infrastructure/repositories/product.repository.impl.ts";

export class ProductsRoutes {

    static get routes(): Router {

        const router = Router();
        const datasource = new ProductDatasourceImpl();
        const repository = new ProductRepositoryImpl(datasource);
        const productsController = new ProductsController(repository);

        router.get("/", productsController.getProducts);
        router.get("/:id", productsController.getProductById);
        router.post("/", productsController.createProduct);
        router.post("/seed", productsController.seedProducts);
        router.put("/:id/inventory-adjustment", productsController.inventoryAdjustment);

        return router;
    }

}