import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to DB');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    const total = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(total / limit);
    const products = await this.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { available: true },
    });
    return {
      data: products,
      meta: {
        total,
        page,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    console.log('Prod MS > findOne > id', id);
    const product = await this.product.findUnique({
      where: { id, available: true },
    });
    if (!product) {
      throw new RpcException({
        message: 'Product not found KHE',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...toUpdate } = updateProductDto;
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.product.update({
      where: { id },
      data: toUpdate,
    });
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    // HARD DELETE
    // return this.product.delete({ where: { id } });
    // SOFT DELETE
    return this.product.update({
      where: { id },
      data: { available: false },
    });
  }
}
