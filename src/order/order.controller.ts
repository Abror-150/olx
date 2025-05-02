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
  HttpStatus,
  Res,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/user/auth/auth.guard';
import { ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    const userId = req['user-id'];
    return this.orderService.createOrder(createOrderDto, userId);
  }

  @Get('export-excel')
  async exportExcel(@Res() res: Response) {
    console.log('Export Excel endpoint called for orders');
    try {
      const buffer = await this.orderService.exportToExcel();

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=orders_${new Date().toISOString()}.xlsx`,
      );

      console.log('Sending Excel file to client');
      return res.status(HttpStatus.OK).send(buffer);
    } catch (error) {
      console.error('Error in exportExcel:', error);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error exporting orders to Excel',
        error: error.message,
      });
    }
  }
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
