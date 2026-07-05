import { prisma } from "../../data/postgres/index.ts";
import { AlertEntity, type AlertDatasource, type FilterAlertDto } from "../../domain/index.ts";
import type { Prisma } from "../../generated/prisma/client.ts";

export class AlertDatasourceImpl implements AlertDatasource {

    async getAll(filterAlertDto: FilterAlertDto): Promise<AlertEntity[]> {
        const { estado_alerta } = filterAlertDto;

        const where: Prisma.AlertsWhereInput = {
            ...(estado_alerta !== undefined && { estado: estado_alerta }),
        }

        const alerts = await prisma.alerts.findMany({ where });

        return alerts.map(AlertEntity.fromObject);
    }

}