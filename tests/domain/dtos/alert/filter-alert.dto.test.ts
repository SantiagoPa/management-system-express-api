import { FilterAlertDto } from "../../../../src/domain/index.ts";

describe("Dtos domain/dtos/alert testing", () => {

    it("debe retornar un arreglo de errores - no se proporcionó un payload válido [FilterAlertDto]", () => {

        const [error] = FilterAlertDto.create({ estado_alerta: "PENDIENTE" });

        expect(error).toEqual(
            [
                "estado_alerta: El 'estado_alerta' debe ser 'ACTIVA' o 'RESUELTA'",
            ]
        );
    });

    it("debe retornar un error indefinido y una instancia de FilterAlertDto - se proporciona un estado_alerta válido [FilterAlertDto]", () => {

        const [error, dto] = FilterAlertDto.create({ estado_alerta: "ACTIVA" });

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(FilterAlertDto);
        expect(dto?.estado_alerta).toBe("ACTIVA");
    });

    it("debe retornar un error indefinido y una instancia de FilterAlertDto - estado_alerta es opcional [FilterAlertDto]", () => {

        const [error, dto] = FilterAlertDto.create({});

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(FilterAlertDto);
        expect(dto?.estado_alerta).toBeUndefined();
    });

    it("debe retornar un error indefinido y una instancia de FilterAlertDto - se proporciona estado_alerta con valor RESUELTA [FilterAlertDto]", () => {

        const [error, dto] = FilterAlertDto.create({ estado_alerta: "RESUELTA" });

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(FilterAlertDto);
        expect(dto?.estado_alerta).toBe("RESUELTA");
    });

});