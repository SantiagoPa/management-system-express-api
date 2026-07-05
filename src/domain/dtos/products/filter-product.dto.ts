import z from 'zod';
import { StatusAlert, TypeCategory } from "../../../generated/prisma/enums.ts";
import { formatErrrorsSchemasZod } from '../../../utils/formatErrrorsSchemasZod.ts';


const filterProductSchema = z.object({
    "categoria": z.enum(["Bebidas", "Lacteos", "Snacks", "Limpieza", "Frutas", "Granos"], {
        message: "La 'categoria' debe ser una de las siguientes opciones: Bebidas, Lacteos, Snacks, Limpieza, Frutas, Granos"
    }),
    "proveedor": z.string("El 'proveedor' debe venir en formato texto").optional(),
    "estado_alerta": z.enum(["ACTIVA", "RESUELTA"], {
        message: "El 'estado_alerta' debe ser 'ACTIVA' o 'RESUELTA'"
    }).optional(),
    "rango_stock": z.string("El 'rango_stock' debe venir en formato texto 'minimo-maximo', ej: '1-3'").includes("-", {
        message: "El 'rango_stock' debe venir en formato texto 'minimo-maximo', ej: '1-3'"
    }).optional(),
});

export class FilterProductDto {

    constructor(
        public readonly categoria?: TypeCategory,
        public readonly proveedor?: string,
        public readonly estado_alerta?: StatusAlert,
        public readonly rango_stock?: [number, number] | undefined,
    ) { }

    static create(props: Record<string, any>): [string[] | undefined, FilterProductDto?] {
        const result = filterProductSchema.safeParse(props);
        if (!result.success) {
            const errors = formatErrrorsSchemasZod(JSON.parse(result.error.message));
            return [errors];
        }
        const { categoria, proveedor, estado_alerta, rango_stock = "" } = props;
        const [min, max] = rango_stock?.split("-");
        const newRangoStock: [number, number] | undefined = rango_stock ? [Number(min), Number(max)] : undefined;

        return [undefined, new FilterProductDto(categoria, proveedor, estado_alerta, newRangoStock)];
    }
}