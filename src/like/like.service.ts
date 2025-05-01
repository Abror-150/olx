import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { log } from 'console';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async create(createLikeDto: CreateLikeDto, userId: string) {
    try {
      const { productId } = createLikeDto;

      const product = await this.prisma.product.findFirst({
        where: { id: productId },
      });
      if (!product) {
        throw new NotFoundException('Mahsulot topilmadi');
      }

      const existingLike = await this.prisma.like.findFirst({
        where: { productId, userId },
      });
      if (existingLike) {
        return { message: 'like already exists' };
      }

      const like = await this.prisma.like.create({
        data: {
          productId,
          userId,
        },
      });

      return {
        message: 'Like qo‘shildi',
        data: like,
      };
    } catch (error) {
      console.log(error);

      throw new BadRequestException('Like qo‘shishda xatolik yuz berdi');
    }
  }

  async remove(id: string, userId: string) {
    try {
      const like = await this.prisma.like.findFirst({ where: { id, userId } });
      if (!like) {
        return { message: 'like not found' };
      }

      await this.prisma.like.delete({ where: { id } });

      return {
        message: 'Like deleted',
      };
    } catch (error) {
      throw new BadRequestException('Like o‘chirishda xatolik yuz berdi');
    }
  }
  async getLikedProductsByUser(userId: string) {
    const likes = await this.prisma.like.findMany({
      where: { userId },
      include: { product: true },
    });

    return likes.map((like) => like.product);
  }
}
