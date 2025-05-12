import { UpdateProductDto } from '../dto/update-product.dto';

export class Product {
  //   public id: string;
  //   public name: string;
  //   public description: string;
  //   public price: number;

  constructor(
    public id: string,
    public name: string,
    public description: string,
    public price: number,
  ) {}

  updateWith(updateProductDto: Omit<UpdateProductDto, 'id'>) {
    if (updateProductDto.name) this.name = updateProductDto.name;
    if (updateProductDto.description)
      this.description = updateProductDto.description;
    if (updateProductDto.price) this.price = Number(updateProductDto.price);
  }
}
