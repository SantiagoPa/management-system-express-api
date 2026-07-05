
import z from 'zod';
import { formatErrrorsSchemasZod } from '../../../utils/formatErrrorsSchemasZod.ts';

const orderSchema = z.object({
    "producto_id": z.number("El 'producto_id' debe ser numerico"),
    "cantidad_solicitada": z.number("La 'cantidad_solicitada' es requerido").positive("Debe ser mayor a 0").nonoptional("La 'cantidad_solicitada' es requerido"),
});

export class CreateOrderDto {

    private constructor(
        public readonly producto_id: number,
        public readonly cantidad_solicitada: number,
    ) { }

    static create(props: Record<string, any>): [string[] | undefined, CreateOrderDto?] {
        const result = orderSchema.safeParse(props);
        if (!result.success) {
            const errors = formatErrrorsSchemasZod(JSON.parse(result.error.message));
            return [errors];
        }
        const { producto_id, cantidad_solicitada } = props;
        return [undefined, new CreateOrderDto(producto_id, cantidad_solicitada)];
    }
}