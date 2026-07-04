
import z from 'zod';
import { formatErrrorsSchemasZod } from '../../../utils/formatErrrorsSchemasZod.ts';

const productSchema = z.object({
    "nombre": z.string("El 'nombre' es requerido").min(3, "debe tener al menos 3 caracteres").max(300, "debe tener maximo 300 caracteres").nonempty("El 'nombre' es requerido"),
    "codigo_sku": z.string("El 'codigo_sku' es requerido").nonempty("El 'codigo_sku' es requerido").min(6, "debe tener al menos 6 caracteres").max(20, "debe tener maximo 20 caracteres"),
    "categoria": z.string("La 'categoria' es requerida").nonempty("La 'categoria' es requerida"),
    "precio": z.number("El 'precio' es requerido").positive("Debe ser mayor a 0").nonoptional("El 'precio' es requerido"),
    "stock_actual": z.number("El 'stock_actual' es requerido").positive("Debe ser mayor o igual a 0").nonoptional("El 'stock_actual' es requerido"),
    "stock_minimo": z.number("El 'stock_minimo' es requerido").positive("Debe ser mayor o igual a 0").nonoptional("El 'stock_minimo' es requerido"),
    "proveedor": z.string("El 'proveedor' es requerido").nonempty("El 'proveedor' es requerido")
});

export class CreateProductDto {

    private constructor(
        public readonly nombre: string,
        public readonly codigo_sku: string,
        public readonly categoria: string,
        public readonly precio: number,
        public readonly stock_actual: number,
        public readonly stock_minimo: number,
        public readonly proveedor: string,
    ) { }

    static create(props: Record<string, any>): [string[] | undefined, CreateProductDto?] {
        const result = productSchema.safeParse(props);
        if (!result.success) {
            const errors = formatErrrorsSchemasZod(JSON.parse(result.error.message));
            return [errors];
        }
        const { nombre, codigo_sku, categoria, precio, stock_actual, stock_minimo, proveedor } = props;
        return [undefined, new CreateProductDto(nombre, codigo_sku, categoria, precio, stock_actual, stock_minimo, proveedor)];
    }
}