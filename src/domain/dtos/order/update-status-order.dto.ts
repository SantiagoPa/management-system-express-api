
import z from 'zod';
import { formatErrrorsSchemasZod } from '../../../utils/formatErrrorsSchemasZod.ts';

const orderSchema = z.object({
    "id": z.string("El 'id' debe ser texto").nonempty("El 'id' es requerido"),
    "type_action": z.enum(["aprobar", "rechazar", "recibir"], {
        message: "El 'type_action' debe ser 'aprobar', 'rechazar' o 'recibir'"
    }),
    "motivo": z.string("El 'motivo' debe ser texto")
        .min(10, { message: "Minimo deben ser 10 caracteres" })
        .optional()
}).superRefine((data, ctx) => {
    if (data.type_action === "rechazar" && !data.motivo) {
        ctx.addIssue({
            code: "custom",
            message: "El 'motivo' es requerido cuando se rechaza",
            path: ["motivo"],
        });
    }
});

export class UpdateStatusOrderDto {

    private constructor(
        public readonly id: string,
        public readonly type_action: "aprobar" | "rechazar" | "recibir",
        public readonly motivo?: string,
    ) { }

    static create(props: Record<string, any>): [string[] | undefined, UpdateStatusOrderDto?] {
        const result = orderSchema.safeParse(props);
        if (!result.success) {
            const errors = formatErrrorsSchemasZod(JSON.parse(result.error.message));
            return [errors];
        }
        const { id, type_action, motivo } = props;
        return [undefined, new UpdateStatusOrderDto(id, type_action, motivo)];
    }
}