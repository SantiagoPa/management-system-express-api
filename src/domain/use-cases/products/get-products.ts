import type { FilterProductDto } from "../../dtos/products/filter-product.dto.ts";
import type { ProductEntity } from "../../entities/product.entity.ts";
import type { ProductRepository } from "../../repositories/product.repository.ts";

export interface GetProductsUseCase {
    execute(filterProductDto: FilterProductDto): Promise<ProductEntity[]>
}

export class GetProducts implements GetProductsUseCase {

    constructor(
        private readonly repository: ProductRepository
    ) { }

    execute(filterProductDto: FilterProductDto): Promise<ProductEntity[]> {
        return this.repository.getAll(filterProductDto)
    }

}