import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor() {}

  @Post()
  create() {
    return 'Crea un producto';
  }

  @Get()
  findAll() {
    return 'Muestra todos los productos';
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
