
import z from 'zod';
import { formatErrrorsSchemasZod } from '../../../utils/formatErrrorsSchemasZod.ts';

const orderSchema = z.object({
    "id": z.string("El 'id' debe ser texto").nonempty("El 'id' es requerido"),
    "type_action": z.enum(["aprobar", "rechazar", "recibir"], {
        message: "El 'typeAction' debe ser 'aprobar', 'rechazar' o 'recibir'"
    }),
});

export class UpdateStatusOrderDto {

    private constructor(
        public readonly id: string,
        public readonly type_action: "aprobar" | "rechazar" | "recibir",
    ) { }

    static create(props: Record<string, any>): [string[] | undefined, UpdateStatusOrderDto?] {
        const result = orderSchema.safeParse(props);
        if (!result.success) {
            const errors = formatErrrorsSchemasZod(JSON.parse(result.error.message));
            return [errors];
        }
        const { producto_id, cantidad_solicitada } = props;
        return [undefined, new UpdateStatusOrderDto(producto_id, cantidad_solicitada)];
    }
}