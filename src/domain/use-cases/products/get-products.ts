import type { ProductEntity } from "../../entities/product.entity.ts";
import type { ProductRepository } from "../../repositories/product.repository.ts";

export interface GetProductsUseCase {
    execute(): Promise<ProductEntity[]>
}

export class GetProducts implements GetProductsUseCase {

    constructor(
        private readonly repository: ProductRepository
    ) { }

    execute(): Promise<ProductEntity[]> {
        return this.repository.getAll()
    }

}