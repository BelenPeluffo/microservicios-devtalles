import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  Inject,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { PRODUCTS_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCTS_SERVICE) private readonly productsService: ClientProxy,
  ) {}

  @Post()
  create() {
    return 'Crea un producto';
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.send({ cmd: 'findAllProducts' }, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `Muestra el producto con id ${id}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `Elimina el producto con id ${id}`;
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return `Actualiza el producto con id ${id}`;
  }
}
