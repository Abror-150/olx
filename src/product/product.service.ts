import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { colorIds, ...rest } = createProductDto;
    try {
      const product = await this.prisma.product.create({
        data: {
          ...rest,
          ...(colorIds && colorIds.length
            ? { color: { connect: colorIds.map((id) => ({ id })) } }
            : {}),
        },
        include: { color: true },
      });
      return product;
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new BadRequestException('Invalid categoryId or colorIds');
      }
      throw error;
    }
  }

  async findAll(query: {
    name?: string;
    colorId?: string;
    status?: 'USED' | 'OLD' | 'NEW' | 'PENDING';
    from?: number;
    to?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    const {
      name,
      colorId,
      status,
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

    if (colorId) where.colorId = colorId;
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

  async findOne(id: string) {
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
    const comments = product.comment;
    const totalStars = comments.reduce(
      (sum, comment) => sum + (comment.star || 0),
      0,
    );
    const averageStar = comments.length > 0 ? totalStars / comments.length : 0;
    const viewCount = await this.prisma.view.count({
      where: { productId: id },
    });
    return { ...product, viewCount, averageStar: +averageStar.toFixed(1) };
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
