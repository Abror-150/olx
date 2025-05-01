import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateViewDto } from './dto/create-view.dto';
import { UpdateViewDto } from './dto/update-view.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ViewService {
  constructor(private prisma: PrismaService) {}

  async ViewProduct(data: CreateViewDto, userId: string) {
    try {
      let { productId } = data;
      console.log(productId);
      console.log(data);

      const product = await this.prisma.product.findFirst({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException('Mahsulot topilmadi');
      }

      const existingView = await this.prisma.view.findFirst({
        where: { productId: productId, userId: userId },
      });

      if (!existingView) {
        await this.prisma.view.create({
          data: {
            userId: userId,
            productId: productId,
          },
        });
      } else {
        await this.prisma.view.update({
          where: { id: existingView.id },
          data: { createdAt: new Date() },
        });
      }

      return { message: 'view added' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Bad request');
    }
  }
  async getLastViewedProduct(userId: string) {
    const lastViewed = await this.prisma.view.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { product: true },
    });

    if (!lastViewed) {
      throw new NotFoundException('No product viewed by this user');
    }

    return lastViewed;
  }

  async getProductViewCount(productId: string) {
    const viewCount = await this.prisma.view.count({
      where: { productId: productId },
    });
    return viewCount;
  }
}
