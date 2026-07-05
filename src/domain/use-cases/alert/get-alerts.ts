import type { FilterAlertDto } from "../../dtos/index.ts";
import type { AlertEntity } from "../../entities/alert.entity.ts";
import type { AlertRepository } from "../../repositories/alert.repository.ts";

export interface GetAlertsUseCase {
    execute(filterAlertDto: FilterAlertDto): Promise<AlertEntity[]>
}

export class GetAlerts implements GetAlertsUseCase {

    constructor(
        private readonly repository: AlertRepository
    ) { }

    execute(filterAlertDto: FilterAlertDto): Promise<AlertEntity[]> {
        return this.repository.getAll(filterAlertDto);
    }

}