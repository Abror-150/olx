import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as ExcelJS from 'exceljs';
import { Type } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto, userId: string) {
    const { price, discount, colorIds, ...rest } = data;
    const discountValue = Number(discount) || 0;

    try {
      const finalPrice =
        discountValue > 0 ? price - (price * discountValue) / 100 : price;

      const product = await this.prisma.product.create({
        data: {
          ...rest,
          price: finalPrice,
          discount: discountValue,
          userId: userId,
          ...(colorIds && colorIds.length
            ? { color: { connect: colorIds.map((id) => ({ id })) } }
            : {}),
        },
      });

      return product;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
  async exportToExcel(): Promise<Buffer> {
    try {
      const products = await this.prisma.product.findMany();
      console.log('Fetched products:', products);

      if (!products.length) {
        throw new NotFoundException('No products available to export');
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Products');

      worksheet.columns = [
        { header: 'ID', key: 'id', width: 30 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Price', key: 'price', width: 15 },
        { header: 'Category', key: 'categoryId', width: 40 },
      ];

      products.forEach((product) => {
        worksheet.addRow({
          id: product.id,
          name: product.name,
          price: product.price || 0,
        });
      });

      const arrayBuffer = await workbook.xlsx.writeBuffer();
      const buffer = Buffer.from(arrayBuffer);
      console.log('Excel buffer generated successfully');

      return buffer;
    } catch (error) {
      console.error('Error in exportToExcel:', error);
      throw error;
    }
  }
  async myAds(userId: string) {
    const orders = await this.prisma.product.findMany({
      where: { userId },
      include: {
        category: true,
        user: true,
      },
    });

    if (orders.length === 0) {
      throw new NotFoundException('Sizning elonlaringiz topilmadi');
    }

    return orders;
  }
  async findAll(query: {
    name?: string;
    status?: 'USED' | 'OLD' | 'NEW' | 'PENDING';
    from?: number;
    Type?: 'ELECTRONIC' | 'LAPTOPS' | 'FOOD';
    to?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    const {
      name,
      status,
      Type,
      from,
      to,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const where: any = {};

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }
    if (status) where.status = status;
    if (Type) where.type = Type;
    if (status) where.status = status;

    if (from || to) {
      where.price = {};
      if (from) where.price.gte = Number(from);
      if (to) where.price.lte = Number(to);
    }

    const products = await this.prisma.product.findMany({
      where,

      orderBy: {
        [sortBy]: order,
      },
      include: {
        category: true,
        color: true,
        comment: true,
        like: true,
      },
      skip: (page - 1) * limit,
      take: Number(limit),
    });

    const total = await this.prisma.product.count({ where });

    return { total, page, limit, products };
  }

  async findOne(id: string, userId?: string) {
    const product = await this.prisma.product.findFirst({
      where: { id },
      include: {
        category: true,
        color: true,
        comment: true,
        like: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    if (userId) {
      const alreadyViewed = await this.prisma.view.findFirst({
        where: {
          userId,
          productId: id,
        },
      });

      if (!alreadyViewed) {
        await this.prisma.view.create({
          data: {
            userId,
            productId: id,
          },
        });
      }
    }

    const comments = product.comment;
    const totalStars = comments.reduce(
      (sum, comment) => sum + (comment.star || 0),
      0,
    );
    const averageStar = comments.length > 0 ? totalStars / comments.length : 0;

    const viewCount = await this.prisma.view.count({
      where: { productId: id },
    });

    return {
      ...product,
      viewCount,
      averageStar: +averageStar.toFixed(1),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { colorIds, ...rest } = updateProductDto;
    await this.findOne(id);
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: {
          ...rest,
          ...(colorIds
            ? { color: { set: colorIds.map((id) => ({ id })) } }
            : {}),
        },
      });
      return product;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Product with id ${id} not found`);
      }
      if (error.code === 'P2003') {
        throw new BadRequestException('Invalid categoryId or colorIds');
      }
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    try {
      await this.prisma.product.delete({ where: { id } });
      return { message: `Product with id ${id} has been deleted` };
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Product with id ${id} not found`);
      }
      throw error;
    }
  }
}
