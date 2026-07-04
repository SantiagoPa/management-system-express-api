import type { Request, Response } from "express";
import { prisma } from "../../data/postgres/index.ts";
import { CreateProductDto } from "../../domain/dtos/products/create-product.dto.ts";
import { CreateProduct, GetProduct, GetProducts, SeedProduct, type ProductRepository } from "../../domain/index.ts";
import { UpdateAmountProductDto } from "../../domain/dtos/products/update-amount-prodcut.dto.ts";
import { UpdateAmountProduct } from "../../domain/use-cases/products/update-amount-product.ts";
import { FilterProductDto } from "../../domain/dtos/products/filter-product.dto.ts";

export class ProductsController {

    // DI
    constructor(
        private readonly repository: ProductRepository
    ) { }

    public getProducts = async (req: Request, res: Response) => {

        const [errors, filterProductDto] = FilterProductDto.create(req.query);

        if (errors) {
            return res.status(400).json({
                data: null,
                success: false,
                errors,
            });
        }

        new GetProducts(this.repository)
            .execute(filterProductDto!)
            .then(products => res.json(products))
            .catch(error => res.status(400).json({ error }));
    }

    public getProductById = (req: Request, res: Response) => {
        const id = Number(req.params?.id);
        new GetProduct(this.repository)
            .execute(id)
            .then(product => res.json(product))
            .catch(error => res.status(400).json({ error }))
    }

    public createProduct = async (req: Request, res: Response) => {

        const [errors, createProductDto] = CreateProductDto.create(req.body);

        if (errors) {
            return res.status(400).json({
                data: null,
                success: false,
                errors,
            });
        }

        new CreateProduct(this.repository)
            .execute(createProductDto!)
            .then(product => res.json(product))
            .catch(error => res.status(400).json({ error }))
    }

    public seedProducts = async (req: Request, res: Response) => {

        new SeedProduct(this.repository)
            .execute()
            .then(product => res.json(product))
            .catch(error => res.status(400).json({ error }))
    }

    public inventoryAdjustment = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const [errors, updateAmountProductDto] = UpdateAmountProductDto.create({ ...req.body, id });

        if (errors) {
            return res.status(400).json({
                data: null,
                success: false,
                errors,
            });
        }

        new UpdateAmountProduct(this.repository)
            .execute(updateAmountProductDto!)
            .then(product => res.json(product))
            .catch(error => res.status(400).json({ error }))

    }

}