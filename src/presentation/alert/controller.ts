import type { Request, Response } from "express";
import { AlertRepository, FilterAlertDto, GetAlerts } from "../../domain/index.ts";

export class AlertController {


    constructor(
        private readonly repository: AlertRepository
    ) { }

    public getAll = (req: Request, res: Response) => {
        const [errors, filterAlertDto] = FilterAlertDto.create(req.query);

        if (errors) {
            return res.status(400).json({
                data: null,
                success: false,
                errors,
            });
        }

        new GetAlerts(this.repository)
            .execute(filterAlertDto!)
            .then(alerts => res.json(alerts))
            .catch(error => res.status(400).json(error))
    }
}