import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ViewService } from './view.service';
import { CreateViewDto } from './dto/create-view.dto';
import { UpdateViewDto } from './dto/update-view.dto';
import { AuthGuard } from 'src/user/auth/auth.guard';
import { Request } from 'express';

@Controller('view')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @UseGuards(AuthGuard)
  @Get('lastViewProduct')
  findAll(@Req() req: Request) {
    const userId = req['user-id'];
    return this.viewService.lastViewProduct(userId);
  }
}
