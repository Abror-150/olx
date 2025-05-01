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
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/user/auth/auth.guard';
import { RoleGuard } from 'src/user/auth/role.guard';
import { ApiQuery } from '@nestjs/swagger';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    const userId = req['user-id'];
    return this.commentService.create(createCommentDto, userId);
  }

  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'order',
    required: false,
    type: String,
    enum: ['asc', 'desc'],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get()
  findAll(@Query() query) {
    return this.commentService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
