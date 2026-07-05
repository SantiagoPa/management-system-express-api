import { Router } from "express";
import { AlertController } from "./controller.ts";
import { AlertDatasourceImpl } from "../../infrastructure/datasource/alert.datasource.impl.ts";
import { AlertRepositoryImpl } from "../../infrastructure/repositories/alert.repository.impl.ts";

export class AlertRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new AlertDatasourceImpl();
        const repository = new AlertRepositoryImpl(datasource);
        const alertController = new AlertController(repository);

        router.get("/", alertController.getAll);

        return router;
    }
}