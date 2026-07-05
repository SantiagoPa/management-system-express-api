import type { AlertDatasource, AlertEntity, AlertRepository, FilterAlertDto } from "../../domain/index.ts";

export class AlertRepositoryImpl implements AlertRepository {

    constructor(
        private readonly datasource: AlertDatasource
    ) { }

    getAll(filterAlertDto: FilterAlertDto): Promise<AlertEntity[]> {
        return this.datasource.getAll(filterAlertDto);
    }

}