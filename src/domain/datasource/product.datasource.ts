import type { CreateProductDto } from "../dtos/products/create-product.dto.ts";
import type { FilterProductDto } from "../dtos/products/filter-product.dto.ts";
import type { UpdateAmountProductDto } from "../dtos/products/update-amount-prodcut.dto.ts";
import type { ProductEntity } from "../entities/product.entity.ts";

export abstract class ProductDatasource {

    abstract create(createProductDto: CreateProductDto): Promise<ProductEntity>;

    // todo: pagination
    abstract getAll(filterProductDto: FilterProductDto): Promise<ProductEntity[]>;
    abstract findById(id: number): Promise<ProductEntity>;
    abstract updateAmountById(updateAmountProductDto: UpdateAmountProductDto): Promise<ProductEntity>;
    abstract deleteById(id: number): Promise<ProductEntity>;
    abstract seed(): Promise<string>;

}