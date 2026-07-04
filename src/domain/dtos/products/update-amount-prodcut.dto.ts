import z from 'zod';
import { formatErrrorsSchemasZod } from '../../../utils/formatErrrorsSchemasZod.ts';

const productSchema = z.object({
    id: z.number("El 'id' debe ser un numero"),
    motivo: z.string("El 'motivo' es requerido"),
    "operacion": z.enum(["entrada", "salida"], {
        message: "La 'operacion' debe ser 'entrada' o 'salida'"
    }),
    "cantidad": z.number("La 'cantidad' es requerida").positive("Debe ser mayor a 0").nonoptional("La 'cantidad' es requerida"),
});

export class UpdateAmountProductDto {
    private constructor(
        public readonly operacion: "entrada" | "salida",
        public readonly cantidad: number,
        public readonly motivo: string,
        public readonly id: number,
    ) { }

    static create(props: Record<string, any>): [string[] | undefined, UpdateAmountProductDto?] {
        const result = productSchema.safeParse(props);
        if (!result.success) {
            const errors = formatErrrorsSchemasZod(JSON.parse(result.error.message));
            return [errors];
        }
        const { operacion, cantidad, motivo,  id } = props;
        return [undefined, new UpdateAmountProductDto(operacion, cantidad, motivo, id)];
    }
}