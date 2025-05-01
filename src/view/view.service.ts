import { Injectable } from '@nestjs/common';
import { CreateViewDto } from './dto/create-view.dto';
import { UpdateViewDto } from './dto/update-view.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ViewService {
  constructor(private prisma: PrismaService) {}

  async lastViewProduct(userId: string) {
    try {
      let lastView = await this.prisma.view.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              category: true,
              color: true,
            },
          },
        },
        take: 10,
      });
      if (!lastView.length) {
        return { message: 'last view not found' };
      }
      return lastView.map((view) => view.product);
    } catch (error) {
      return error;
    }
  }
}
