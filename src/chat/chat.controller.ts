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
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/user/auth/auth.guard';
import { chatMessageDto } from './dto/create-chatMessage.dto';
import { userRole } from '@prisma/client';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createChatDto: CreateChatDto, @Req() req: Request) {
    const userId = req['user-id'];

    return this.chatService.createChat(createChatDto, userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    const userId = req['user-id'];
    return this.chatService.getChat(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.deleteChat(id);
  }
  @UseGuards(AuthGuard)
  @Post('message')
  createMessage(@Body() data: chatMessageDto, @Req() req: Request) {
    const userId = req['user-id'];
    console.log(userId);

    return this.chatService.createMessage(data, userId);
  }
  @Get('message/:id')
  getMessagee(@Param('id') id: string) {
    return this.chatService.getMessage(id);
  }
  @UseGuards(AuthGuard)
  @Get('myChats')
  myChats(@Req() req: Request) {
    const userId = req['user-id'];
    return this.chatService.myChats(userId);
  }
}
