import { Router } from "express";
import { ProductsRoutes } from "./products/routes.ts";
import { OrderRoutes } from "./order/routes.ts";
import { AlertRoutes } from "./alert/routes.ts";

export class AppRoutes {

    static get routes(): Router {
        const router = Router();

        router.use('/api/products', ProductsRoutes.routes);
        router.use('/api/orders', OrderRoutes.routes);
        router.use('/api/alerts', AlertRoutes.routes);

        router.use('/api/healthy', (_, res)=>res.json({ health: true, message: "API online" }));

        return router;
    }
}