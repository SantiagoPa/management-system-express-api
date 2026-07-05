import z from 'zod';
import { StatusAlert } from "../../../generated/prisma/enums.ts";
import { formatErrrorsSchemasZod } from '../../../utils/formatErrrorsSchemasZod.ts';


const filterAlertSchema = z.object({
    "estado_alerta": z.enum(["ACTIVA", "RESUELTA"], {
        message: "El 'estado_alerta' debe ser 'ACTIVA' o 'RESUELTA'"
    }).optional(),
});

export class FilterAlertDto {

    constructor(
        public readonly estado_alerta?: StatusAlert,
    ) { }

    static create(props: Record<string, any>): [string[] | undefined, FilterAlertDto?] {
        const result = filterAlertSchema.safeParse(props);
        if (!result.success) {
            const errors = formatErrrorsSchemasZod(JSON.parse(result.error.message));
            return [errors];
        }
        const { estado_alerta } = props;

        return [undefined, new FilterAlertDto(estado_alerta)];
    }
}