import { Router } from "express";
import { OrderDatasourceImpl } from "../../infrastructure/datasource/order.datasource.impl.ts";
import { OrderRepositoryImpl } from "../../infrastructure/repositories/order.repository.impl.ts";
import { OrderController } from "./controller.ts";

export class OrderRoutes {
    static get routes(): Router {

        const router = Router();

        const datasource = new OrderDatasourceImpl();
        const repository = new OrderRepositoryImpl(datasource);
        const orderController = new OrderController(repository);

        router.post("/", orderController.createOrder);
        router.put("/:id", orderController.updateStatusOrder);

        return router;
    }
}