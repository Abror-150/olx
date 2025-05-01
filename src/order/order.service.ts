import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { count, log } from 'console';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}
  async createOrder(createOrderDto: CreateOrderDto, userId: string) {
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

  async myAds(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        product: true,
        user: true,
        color: true,
      },
    });

    if (orders.length === 0) {
      throw new NotFoundException('Sizning elonlaringiz topilmadi');
    }

    return orders.map((order) => order.product);
  }

  async getOrderById(orderId: string) {
    try {
      const order = await this.prisma.order.findUnique({
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

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
