import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Type } from '@prisma/client';
import * as ExcelJS from 'exceljs';
import { log } from 'console';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    let category = await this.prisma.category.findFirst({
      where: { name: createCategoryDto.name },
    });
    if (category) {
      throw new BadRequestException('category already exists');
    }
    try {
      return await this.prisma.category.create({ data: createCategoryDto });
    } catch (error) {
      throw new BadRequestException('Failed to create category');
    }
  }

  async findAll(query: {
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    type?: Type;
  }) {
    const {
      search,
      sortBy = 'name',
      order = 'asc',
      page = 1,
      limit = 10,
      type,
    } = query;

    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (type) {
      where.type = type;
    }

    const categories = await this.prisma.category.findMany({
      where,
      orderBy: {
        [sortBy]: order,
      },
      include: {
        product: true,
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    const total = await this.prisma.category.count({ where });

    return {
      total,
      page: Number(page),
      limit: Number(limit),
      categories,
    };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id },
      include: { product: true },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);
    try {
      return await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch (error) {
      throw new BadRequestException('Failed to update category');
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    try {
      await this.prisma.category.delete({ where: { id } });
      return { message: `Category with ID ${id} has been deleted` };
    } catch (error) {
      throw new BadRequestException('Failed to delete category');
    }
  }
  async exportToExcel(): Promise<Buffer> {
    try {
      const categories = await this.prisma.category.findMany();

      if (!categories.length) {
        throw new NotFoundException('No categories available to export');
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Categories');

      worksheet.columns = [
        { header: 'ID', key: 'id', width: 30 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Description', key: 'description', width: 40 },
        { header: 'Image', key: 'img', width: 30 },
      ];

      categories.forEach((cat) => {
        worksheet.addRow({
          id: cat.id,
          name: cat.name,
          description: cat.type || 'N/A',
          img: cat.img || 'N/A',
        });
      });

      const arrayBuffer = await workbook.xlsx.writeBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return buffer;
    } catch (error) {
      throw error;
    }
  }
}
