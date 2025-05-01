import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegionService {
  constructor(private prisma: PrismaService) {}

  async create(createRegionDto: CreateRegionDto) {
    return this.prisma.region.create({
      data: createRegionDto,
    });
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
      order = 'desc',
      page = 1,
      limit = 10,
    } = query;

    let where: any = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    try {
      const regions = await this.prisma.region.findMany({
        where,
        orderBy: sortBy ? { [sortBy]: order } : undefined,
        skip: (page - 1) * limit,
        take: Number(limit),
      });

      const total = await this.prisma.region.count({ where });

      return { total, page, limit, regions };
    } catch (error) {
      console.error('Error in findAll method:', error);
      throw new Error('An error occurred while fetching regions');
    }
  }

  async findOne(id: string) {
    const region = await this.prisma.region.findFirst({
      where: { id },
    });
    if (!region) {
      throw new NotFoundException('Region not found');
    }
    return region;
  }

  async update(id: string, updateRegionDto: UpdateRegionDto) {
    const region = await this.prisma.region.findFirst({ where: { id } });

    if (!region) {
      throw new NotFoundException(`Region with ID "${id}" not found`);
    }
    return this.prisma.region.update({
      where: { id },
      data: updateRegionDto,
    });
  }

  async remove(id: string) {
    return this.prisma.region.delete({
      where: { id },
    });
  }
}
