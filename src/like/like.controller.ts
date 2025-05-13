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
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/user/auth/auth.guard';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createLikeDto: CreateLikeDto, @Req() req: Request) {
    const userId = req['user-id'];
    return this.likeService.create(createLikeDto, userId);
  }
  @UseGuards(AuthGuard)
  @Get('liked')
  getLikedProducts(@Req() req) {
    const userId = req['user-id'];
    return this.likeService.getLikedProductsByUser(userId);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = req['user-id'];
    return this.likeService.remove(id, userId);
  }
}
