import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Search by product name',
  })
  @ApiQuery({
    name: 'colorId',
    required: false,
    type: String,
    description: 'Filter by color ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['USED', 'PENDING', 'OLD', 'NEW'],
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    type: Number,
    description: 'Filter by minimum price',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: Number,
    description: 'Filter by maximum price',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Sort by field',
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
    example: 'desc',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Pagination page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 10,
  })
  findAll(@Query() query: any) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
