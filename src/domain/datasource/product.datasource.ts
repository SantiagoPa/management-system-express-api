import type { CreateProductDto } from "../dtos/products/create-product.dto.ts";
import type { FilterProductDto } from "../dtos/products/filter-product.dto.ts";
import type { UpdateAmountProductDto } from "../dtos/products/update-amount-prodcut.dto.ts";
import type { ProductExtendedEntity } from "../entities/product-extended.entity.ts";
import type { ProductEntity } from "../entities/product.entity.ts";

export abstract class ProductDatasource {

    abstract create(createProductDto: CreateProductDto): Promise<ProductEntity>;
    abstract getAll(filterProductDto: FilterProductDto): Promise<ProductExtendedEntity[]>;
    abstract findById(id: number): Promise<ProductExtendedEntity>;
    abstract updateAmountById(updateAmountProductDto: UpdateAmountProductDto): Promise<ProductEntity>;
    abstract seed(): Promise<string>;
    // abstract deleteById(id: number): Promise<ProductEntity>;

}