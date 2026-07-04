import type { CreateProductDto } from "../../dtos/index.ts";
import type { ProductEntity } from "../../entities/product.entity.ts";
import type { ProductRepository } from "../../repositories/product.repository.ts";

export interface CreateProductUseCase {
    execute( dto: CreateProductDto ): Promise<ProductEntity>
}

export class CreateProduct implements CreateProductUseCase {

    constructor(
        private readonly repository: ProductRepository
    ){}

    execute(dto: CreateProductDto): Promise<ProductEntity> {
        return this.repository.create(dto);
    }

}