import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { log } from 'console';

@Injectable()
export class ColorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateColorDto) {
    try {
      let { name } = data;
      let color = await this.prisma.color.findFirst({ where: { name } });
      if (color) {
        return { message: 'color alreadyc exists' };
      }
      return await this.prisma.color.create({ data: data });
    } catch (error) {
      throw new BadRequestException('Failed to create color');
    }
  }

  async findAll(query: {
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    const {
      search,
      sortBy = 'createdAt',
      order = 'asc',
      page = 1,
      limit = 10,
    } = query;

    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const colors = await this.prisma.color.findMany({
      where,
      orderBy: {
        [sortBy]: order,
      },
      include: {
        product: true,
      },
      skip: Number(page - 1) * Number(limit),
      take: Number(limit),
    });

    const total = await this.prisma.color.count({ where });

    return { total, page, limit, colors };
  }

  async findOne(id: string) {
    const color = await this.prisma.color.findUnique({ where: { id } });
    if (!color) {
      throw new NotFoundException(`Color with ID ${id} not found`);
    }
    return color;
  }

  async update(id: string, updateColorDto: UpdateColorDto) {
    try {
      let color = await this.prisma.color.findFirst({ where: { id } });
      if (!color) {
        throw new NotFoundException('color not found');
      }
      return await this.prisma.color.update({
        where: { id },
        data: updateColorDto,
      });
    } catch (error) {
      throw new BadRequestException('Failed to update color');
    }
  }

  async remove(id: string) {
    try {
      const color = await this.prisma.color.findFirst({ where: { id } });
      if (!color) {
        return { message: `Color with ID ${id} not found` };
      }
      await this.prisma.color.delete({ where: { id } });
      return { message: `Color with ID ${id} has been deleted` };
    } catch (error) {
      console.log(error);

      throw new BadRequestException('Failed to delete color');
    }
  }
}
