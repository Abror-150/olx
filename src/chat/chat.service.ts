import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { chatMessageDto } from './dto/create-chatMessage.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}
  async createChat(data: CreateChatDto, userId: string) {
    try {
      // const existingChat = await this.prisma.chat.findFirst({
      //   where: {
      //     OR: [
      //       { fromId: data.fromId, toId: data.toId },
      //       { fromId: data.toId, toId: data.fromId },
      //     ],
      //   },
      // });

      // if (existingChat) {
      //   return { message: 'already chat exists' };
      // }

      let creadChat = await this.prisma.chat.create({
        data: { ...data, fromId: userId },
      });
      return creadChat;
    } catch (error) {
      return error;
    }
  }

  async getChat(myId: string) {
    try {
      let chat = await this.prisma.chat.findMany({
        where: { OR: [{ fromId: myId }, { toId: myId }] },
        include: { from: true, to: true },
      });
      return chat;
    } catch (error) {
      return error;
    }
  }

  async createMessage(data: chatMessageDto, userId: string) {
    try {
      let createdChat = await this.prisma.message.create({
        data: {
          ...data,
          fromId: userId,
        },
        include: { from: true, to: true },
      });
      return createdChat;
    } catch (error) {
      console.log(error);

      return error;
    }
  }
  async deleteChat(id: string) {
    try {
      let deletechat = await this.prisma.chat.delete({ where: { id } });

      return deletechat;
    } catch (error) {
      return error;
    }
  }
  async myChats(userId: string) {
    try {
      const chats = await this.prisma.chat.findMany({
        where: {
          OR: [{ fromId: userId }, { toId: userId }],
        },
        include: {
          message: true,
          from: true,
          to: true,
        },
      });

      return chats;
    } catch (error) {
      console.error('myChats error:', error);
      throw new Error('Failed to fetch chats');
    }
  }

  async getMessage(chatId: string) {
    try {
      let messages = await this.prisma.message.findMany({
        where: { chatId: chatId },
        include: { from: true, to: true, chat: true },
      });

      return messages;
    } catch (error) {
      return error;
    }
  }
}
