import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request } from 'express';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, userId: string) {
    try {
      const { message, productId, star } = createCommentDto;

      return await this.prisma.comment.create({
        data: { message, userId, productId, star },
      });
    } catch (error) {
      console.log(error);

      throw new BadRequestException('Failed to create comment');
    }
  }

  async findAll(query: {
    productId?: string;
    userId?: string;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    const {
      search,
      sortBy = 'star',
      order = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const where: any = {};

    if (search) {
      where.message = {
        contains: search,
        mode: 'insensitive',
      };
    }

    try {
      const comments = await this.prisma.comment.findMany({
        where,
        orderBy: {
          [sortBy]: order,
        },
        include: {
          product: true,
          user: true,
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      const total = await this.prisma.comment.count({ where });

      return {
        total,
        page: Number(page),
        limit: Number(limit),
        comments,
      };
    } catch (error) {
      console.log(error);

      throw new BadRequestException('Failed to retrieve comments');
    }
  }

  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: { user: true, product: true },
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    await this.findOne(id);
    try {
      return await this.prisma.comment.update({
        where: { id },
        data: updateCommentDto,
        include: { user: true, product: true },
      });
    } catch (error) {
      throw new BadRequestException('Failed to update comment');
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    try {
      await this.prisma.comment.delete({ where: { id } });
      return { message: `Comment with ID ${id} has been deleted` };
    } catch (error) {
      throw new BadRequestException('Failed to delete comment');
    }
  }
}
