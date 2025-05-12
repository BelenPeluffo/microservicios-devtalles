import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProductsService {
  private products: Array<Product> = [];

  create(createProductDto: CreateProductDto) {
    const { name, description, price } = createProductDto;
    const newProduct = new Product(uuid(), name, description!, Number(price));
    this.products.push(newProduct);
    return newProduct;
  }

  findAll() {
    return this.products;
  }

  findOne(id: string) {
    const product = this.products.find((product) => product.id === id);
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    const product = this.findOne(id);
    // El __ se usa como convención para señalar que una propiedad no
    // será empleada:
    const { id: __, ...data } = updateProductDto;
    product.updateWith(data);
    return product;
  }

  remove(id: string) {
    const product = this.findOne(id); // Verifica que exista
    this.products = this.products.filter((product) => product.id !== id);
    // La convención es devolver el producto eliminado:
    return product;
  }
}
