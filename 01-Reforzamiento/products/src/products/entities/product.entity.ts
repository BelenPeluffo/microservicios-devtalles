import { UpdateProductDto } from '../dto/update-product.dto';

export class Product {
  //   public id: string;
  //   public name: string;
  //   public description: string;
  //   public price: number;

  constructor(
    public id: string,
    public name: string,
    public description: string | undefined,
    public price: number,
  ) {}

  updateWith(updateProductDto: Omit<UpdateProductDto, 'id'>) {
    this.name = updateProductDto.name ?? this.name;
    this.description = updateProductDto.description ?? this.description;
    this.price = updateProductDto.price ?? this.price;
  }
}
