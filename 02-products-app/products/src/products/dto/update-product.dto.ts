import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
