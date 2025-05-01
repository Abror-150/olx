import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SesionService } from './sesion.service';

@Controller('sesion')
export class SesionController {
  constructor(private readonly sesionService: SesionService) {}

  @Get()
  findAll() {
    return this.sesionService.findAll();
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sesionService.remove(id);
  }
}
