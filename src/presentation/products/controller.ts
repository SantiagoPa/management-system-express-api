import type { Request, Response } from "express";
import { CreateProductDto } from "../../domain/dtos/products/create-product.dto.ts";
import { CreateProduct, GetProduct, GetProducts, SeedProduct, type ProductRepository } from "../../domain/index.ts";
import { UpdateAmountProductDto } from "../../domain/dtos/products/update-amount-prodcut.dto.ts";
import { UpdateAmountProduct } from "../../domain/use-cases/products/update-amount-product.ts";
import { FilterProductDto } from "../../domain/dtos/products/filter-product.dto.ts";
import { PrismaClientKnownRequestError } from "../../generated/prisma/internal/prismaNamespace.ts";
import { CustomError } from "../../domain/error/custom-error.ts";

export class ProductsController {

    // DI
    constructor(
        private readonly repository: ProductRepository
    ) { }

    public getProducts = async (req: Request, res: Response) => {

        const [errors, filterProductDto] = FilterProductDto.create(req.query);

        if (errors) {
            return res.status(400).json({ errors });
        }

        new GetProducts(this.repository)
            .execute(filterProductDto!)
            .then(products => res.json(products))
            .catch(error => this.handleError(error, res));
    }

    public getProductById = (req: Request, res: Response) => {
        const id = Number(req.params?.id);
        new GetProduct(this.repository)
            .execute(id)
            .then(product => res.json(product))
            .catch(error => this.handleError(error, res))
    }

    public createProduct = async (req: Request, res: Response) => {

        const [errors, createProductDto] = CreateProductDto.create(req.body);

        if (errors) {
            return res.status(400).json({ errors });
        }

        new CreateProduct(this.repository)
            .execute(createProductDto!)
            .then(product => res.json(product))
            .catch(error => this.handleError(error, res))
    }

    public seedProducts = async (req: Request, res: Response) => {

        new SeedProduct(this.repository)
            .execute()
            .then(product => res.json(product))
            .catch(error => this.handleError(error, res))
    }

    public inventoryAdjustment = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const [errors, updateAmountProductDto] = UpdateAmountProductDto.create({ ...req.body, id });

        if (errors) {
            return res.status(400).json({ errors });
        }

        new UpdateAmountProduct(this.repository)
            .execute(updateAmountProductDto!)
            .then(product => res.json(product))
            .catch(error => this.handleError(error, res))

    }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof PrismaClientKnownRequestError) {
            // @ts-expect-error - Prisma no tipa driverAdapterError.cause correctamente
            const { originalCode, constraint } = error.meta?.driverAdapterError?.cause;
            if (originalCode && originalCode === "23505" && constraint?.fields) {
                return res.status(400).json({
                    error: `El ${constraint.fields[0]} que enviaste ya existe!`
                })
            }
        }

        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }

}