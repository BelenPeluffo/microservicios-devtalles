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
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
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
  async findOne(@Param('id') id: string) {
    try {
      const product = await firstValueFrom(
        this.productsService.send({ cmd: 'findOneProduct' }, id),
      );
      return product;
    } catch (error) {
      throw new BadRequestException(error);
    }
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
