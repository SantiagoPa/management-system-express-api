import type { FilterAlertDto } from "../dtos/index.ts";
import type { AlertEntity } from "../entities/alert.entity.ts";


export abstract class AlertRepository {
    abstract getAll(filterAlertDto: FilterAlertDto): Promise<AlertEntity[]>;
}