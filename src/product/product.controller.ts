import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/auth/auth.guard';
import { Request } from 'express';
import { ViewGuard } from 'src/view/view.guard';
import { Response } from 'express';
import { RoleGuard } from 'src/user/auth/role.guard';
import { adminRole } from 'src/user/adminRole/adminrole.enum';
import { Rolee } from 'src/user/decarator/dec';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto, @Req() req: Request) {
    const userId = req['user-id'];
    return this.productService.create(createProductDto, userId);
  }
  @UseGuards(AuthGuard)
  @Get('export-excel')
  async asdsdf(@Res() res: Response) {
    try {
      const buffer = await this.productService.exportToExcel();

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=products_${new Date().toISOString()}.xlsx`,
      );

      return res.status(HttpStatus.OK).send(buffer);
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error exporting products to Excel',
        error: error.message,
      });
    }
  }
  @Get()
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Search by product name',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['USED', 'PENDING', 'OLD', 'NEW'],
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['LAPTOPS', 'Phone', 'Electronics', 'Accessories'],
    description: 'Filter by type',
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
  @UseGuards(AuthGuard)
  @Get('myElonlars')
  async myElons(@Req() req: Request) {
    const userId = req['user-id'];

    return this.productService.myAds(userId);
  }
  @UseGuards(ViewGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = req['user-id'];
    return this.productService.findOne(id, userId);
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
