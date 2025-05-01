import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSesionDto } from './dto/create-sesion.dto';
import { UpdateSesionDto } from './dto/update-sesion.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SesionService {
  constructor(private prisma: PrismaService) {}
  async findAll() {
    try {
      let data = await this.prisma.sesion.findMany({ include: { user: true } });
      return data;
    } catch (error) {
      throw new BadRequestException('bad request');
    }
  }

  async remove(id: string) {
    try {
      const session = await this.prisma.sesion.findUnique({ where: { id } });
      if (!session) {
        return { message: 'sesion not found' };
      }
      let deleted = await this.prisma.sesion.delete({ where: { id } });
      return deleted;
    } catch (error) {
      throw new BadRequestException('bad request');
    }
  }
}
