import type { FilterAlertDto } from "../dtos/index.ts";
import type { AlertEntity } from "../entities/alert.entity.ts";

export abstract class AlertDatasource {
    abstract getAll(filterAlertDto: FilterAlertDto): Promise<AlertEntity[]>;
}