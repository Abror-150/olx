import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { adminRole } from 'src/user/adminRole/adminrole.enum';
import { RoleGuard } from 'src/user/auth/role.guard';
import { AuthGuard } from 'src/user/auth/auth.guard';
import { Rolee } from 'src/user/decarator/dec';

@Injectable()
export class RegionService {
  constructor(private prisma: PrismaService) {}
  @Rolee(adminRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  async create(createRegionDto: CreateRegionDto) {
    return this.prisma.region.create({
      data: createRegionDto,
    });
  }
  async exportToExcel(): Promise<Buffer> {
    try {
      const regions = await this.prisma.region.findMany();
      console.log('Fetched regions:', regions);

      if (!regions.length) {
        throw new NotFoundException('No regions available to export');
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Regions');

      worksheet.columns = [
        { header: 'ID', key: 'id', width: 30 },
        { header: 'Name', key: 'name', width: 30 },
      ];

      regions.forEach((region) => {
        worksheet.addRow({
          id: region.id,
          name: region.name,
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
      include: { user: true },
    });
    if (!region) {
      throw new NotFoundException('Region not found');
    }
    return region;
  }
  @Rolee(adminRole.ADMIN, adminRole.SUPER_ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
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
  @Rolee(adminRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  async remove(id: string) {
    return this.prisma.region.delete({
      where: { id },
    });
  }
}
