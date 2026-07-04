import { Router } from "express";
import { ProductsRoutes } from "./products/routes.ts";

export class AppRoutes {

    static get routes(): Router {
        const router = Router();

        router.use('/api/products', ProductsRoutes.routes);
        
        return router;
    }
}