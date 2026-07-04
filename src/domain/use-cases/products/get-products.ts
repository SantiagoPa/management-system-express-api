import type { FilterProductDto } from "../../dtos/products/filter-product.dto.ts";
import type { ProductExtendedEntity } from "../../entities/product-extended.entity.ts";
import type { ProductRepository } from "../../repositories/product.repository.ts";

export interface GetProductsUseCase {
    execute(filterProductDto: FilterProductDto): Promise<ProductExtendedEntity[]>
}

export class GetProducts implements GetProductsUseCase {

    constructor(
        private readonly repository: ProductRepository
    ) { }

    execute(filterProductDto: FilterProductDto): Promise<ProductExtendedEntity[]> {
        return this.repository.getAll(filterProductDto)
    }

}