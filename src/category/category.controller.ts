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
  Header,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Type, userRole } from '@prisma/client';
import { AuthGuard } from 'src/user/auth/auth.guard';
import { RoleGuard } from 'src/user/auth/role.guard';
import { Rolee } from 'src/user/decarator/dec';
import { Response } from 'express';
import { adminRole } from 'src/user/adminRole/adminrole.enum';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Rolee(adminRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }
  @Rolee(adminRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get('export-excel')
  async exportExcel(@Res() res: Response) {
    try {
      const buffer = await this.categoryService.exportToExcel();

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=categories_${new Date().toISOString()}.xlsx`,
      );

      return res.status(HttpStatus.OK).send(buffer);
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error exporting categories to Excel',
        error: error.message,
      });
    }
  }
  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by category name',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name'],
    description: 'Sort by field',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order (ascending or descending)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: 'number',
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Number of categories per page',
  })
  @ApiQuery({ name: 'type', required: false, enum: Type })
  findAll(@Query() query) {
    return this.categoryService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }
  @Rolee(adminRole.ADMIN, adminRole.SUPER_ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }
  @Rolee(adminRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
