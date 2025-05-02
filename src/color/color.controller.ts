import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/auth/auth.guard';
import { RoleGuard } from 'src/user/auth/role.guard';
import { Rolee } from 'src/user/decarator/dec';
import { adminRole } from 'src/user/adminRole/adminrole.enum';
import { userRole } from '@prisma/client';

@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Rolee(adminRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createColorDto: CreateColorDto) {
    return this.colorService.create(createColorDto);
  }
  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Filter by color name',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    example: 'name',
    description: 'Sort by column (e.g., name)',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  findAll(@Query() query: any) {
    return this.colorService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colorService.findOne(id);
  }
  @Rolee(adminRole.ADMIN, adminRole.SUPER_ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto) {
    return this.colorService.update(id, updateColorDto);
  }
  @Rolee(adminRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colorService.remove(id);
  }
}
