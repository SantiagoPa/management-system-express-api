import { FilterAlertDto } from "../../../../src/domain/index.ts";


describe("Dtos domain/dtos/alert testing", () => {

    it("should return array string error - does not provide the correct payload [FilterAlertDto]", () => {

        const [error] = FilterAlertDto.create({ estado_alerta: "PENDIENTE" });

        expect(error).toEqual(
            [
                "estado_alerta: El 'estado_alerta' debe ser 'ACTIVA' o 'RESUELTA'",
            ]
        );
    });

    it("should return undefined error and a FilterAlertDto instance - provides a valid estado_alerta [FilterAlertDto]", () => {

        const [error, dto] = FilterAlertDto.create({ estado_alerta: "ACTIVA" });

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(FilterAlertDto);
        expect(dto?.estado_alerta).toBe("ACTIVA");
    });

    it("should return undefined error and a FilterAlertDto instance - estado_alerta is optional [FilterAlertDto]", () => {

        const [error, dto] = FilterAlertDto.create({});

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(FilterAlertDto);
        expect(dto?.estado_alerta).toBeUndefined();
    });

    it("should return undefined error and a FilterAlertDto instance - provides estado_alerta RESUELTA [FilterAlertDto]", () => {

        const [error, dto] = FilterAlertDto.create({ estado_alerta: "RESUELTA" });

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(FilterAlertDto);
        expect(dto?.estado_alerta).toBe("RESUELTA");
    });

});
