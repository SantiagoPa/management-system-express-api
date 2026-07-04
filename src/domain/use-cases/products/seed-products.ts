import type { ProductRepository } from "../../repositories/product.repository.ts";

export interface SeedProductsUseCase {
    execute(): Promise<string>
}

export class SeedProduct implements SeedProductsUseCase {

    constructor(
        private readonly repository: ProductRepository
    ){}

    execute(): Promise<string> {
        return this.repository.seed();
    }

}