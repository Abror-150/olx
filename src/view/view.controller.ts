import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ViewService } from './view.service';
import { Request } from 'express';
import { CreateViewDto } from './dto/create-view.dto';
import { AuthGuard } from 'src/user/auth/auth.guard';

@Controller('view')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createView(@Body() createViewDto: CreateViewDto, @Req() req: Request) {
    const userId = req['user-id'];
    return this.viewService.ViewProduct(createViewDto, userId);
  }
  @Get('lastViewProduct')
  @UseGuards(AuthGuard)
  async lastViewProduct(@Req() req: Request) {
    const userId = req['user-id'];
    return this.viewService.getLastViewedProduct(userId);
  }
}
