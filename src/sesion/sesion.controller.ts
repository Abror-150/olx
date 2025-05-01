import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SesionService } from './sesion.service';
import { adminRole } from 'src/user/adminRole/adminrole.enum';
import { Rolee } from 'src/user/decarator/dec';
import { RoleGuard } from 'src/user/auth/role.guard';
import { AuthGuard } from 'src/user/auth/auth.guard';

@Controller('sesion')
export class SesionController {
  constructor(private readonly sesionService: SesionService) {}
  @Rolee(adminRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.sesionService.findAll();
  }
  @Rolee(adminRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sesionService.remove(id);
  }
}
