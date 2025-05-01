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

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.createChat(createChatDto);
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
  @Post('message')
  createMessage(@Body() data: chatMessageDto) {
    return this.chatService.createMessage(data);
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
