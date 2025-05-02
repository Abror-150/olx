import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { count, log } from 'console';
import { find } from 'rxjs';
import * as ExcelJS from 'exceljs';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}
  async createOrder(createOrderDto: CreateOrderDto, userId: string) {
    let findColor = await this.prisma.color.findFirst({
      where: { id: createOrderDto.colorId },
    });
    if (!findColor) {
      throw new NotFoundException('color not found');
    }
    let findProduct = await this.prisma.product.findFirst({
      where: { id: createOrderDto.productId },
    });
    if (!findProduct) {
      throw new NotFoundException('product not found');
    }
    try {
      const orderr = await this.prisma.order.create({
        data: {
          img: createOrderDto.img,
          count: createOrderDto.count,
          colorId: createOrderDto.colorId,
          userId: userId,
          productId: createOrderDto.productId,
        },
      });
      return orderr;
    } catch (error) {
      console.log(error);

      throw new BadRequestException('Order yaratishda xato yuz berdi');
    }
  }
  async exportToExcel(): Promise<Buffer> {
    try {
      const orders = await this.prisma.order.findMany();

      if (!orders.length) {
        throw new NotFoundException('No orders available to export');
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Orders');

      worksheet.columns = [
        { header: 'ID', key: 'id', width: 30 },
        { header: 'User ID', key: 'userId', width: 30 },
        { header: 'Total', key: 'total', width: 15 },
        { header: 'Status', key: 'status', width: 20 },
        { header: 'Created At', key: 'createdAt', width: 25 },
      ];

      orders.forEach((order) => {
        worksheet.addRow({
          id: order.id,
          userId: order.userId || 'N/A',
          img: order.img || 0,
          count: order.count || 'N/A',
          createdAt: order.createdAt ? order.createdAt.toISOString() : 'N/A',
        });
      });

      const arrayBuffer = await workbook.xlsx.writeBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return buffer;
    } catch (error) {
      console.error('Error in exportToExcel:', error);
      throw error;
    }
  }
  async myOrder(userId: string) {
    try {
      const orders = await this.prisma.order.findMany({
        where: { userId: userId },
        include: {
          product: true,
          color: true,
        },
      });
      if (!orders || orders.length === 0) {
        return { message: 'order not found' };
      }
      return orders;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error fetching orders');
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    orderByCount?: 'asc' | 'desc';
  }) {
    const { page = 1, limit = 10, orderByCount = 'desc' } = query;

    const groupedProducts = await this.prisma.order.groupBy({
      by: ['productId'],
      _count: {
        productId: true,
      },
      orderBy: {
        _count: {
          productId: orderByCount,
        },
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    const productIds = groupedProducts.map((group) => group.productId);

    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      include: { color: true, order: true, category: true },
    });

    const sortedProducts = productIds.map((id) =>
      products.find((p) => p.id === id),
    );

    return {
      total: groupedProducts.length,
      page: Number(page),
      limit: Number(limit),
      products: sortedProducts,
    };
  }

  async getOrderById(orderId: string) {
    const findOrder = await this.prisma.order.findFirst({
      where: { id: orderId },
    });
    if (!findOrder) {
      throw new NotFoundException('order not found');
    }
    try {
      const order = await this.prisma.order.findFirst({
        where: { id: orderId },
        include: {
          color: true,
          user: true,
          product: true,
        },
      });

      if (!order) {
        throw new NotFoundException('Order topilmadi');
      }

      return order;
    } catch (error) {}
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
    });
  }

  async remove(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    await this.prisma.order.delete({
      where: { id },
    });

    return { message: `Order with ID ${id} has been deleted` };
  }
}
