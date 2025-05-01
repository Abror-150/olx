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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/user/auth/auth.guard';
import { ApiQuery } from '@nestjs/swagger';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    const userId = req['user-id'];
    return this.orderService.createOrder(createOrderDto, userId);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'orderByCount',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
    description: 'Sort by product order count',
  })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('orderByCount') orderByCount?: 'asc' | 'desc',
  ) {
    return this.orderService.findAll({ page, limit, orderByCount });
  }

  @UseGuards(AuthGuard)
  @Get('myOrder')
  myOrder(@Req() req: Request) {
    const userId = req['user-id'];

    return this.orderService.myOrder(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
