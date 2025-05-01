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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserLoginDto } from './dto/create-user.dtoLogin. copy';
import { emailDto } from './dto/createEmaildto';
import { otpDto } from './dto/create-user.dtootp copy';
import { AuthGuard } from './auth/auth.guard';
import { ChangePasswordDto } from './dto/changed.user.dto';
import { UserQueryDto } from './dto/changed.user.Query.dto copy';
import { log } from 'console';
import { Request } from 'express';
import { RefreshTokendDto } from './dto/changed.user.dtoRefresh';
import { CreateAdminDto } from './dto/changed.user.dtoAdmin';
import { RoleGuard } from './auth/role.guard';
import { Rolee, ROLES_KEY } from './decarator/dec';
import { userRole } from '@prisma/client';
import { adminRole } from './adminRole/adminrole.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }
  @Post('login')
  login(@Body() data: CreateUserLoginDto, @Req() req: Request) {
    return this.userService.login(data, req);
  }
  @Post('sendEmail')
  create(@Body() data: emailDto) {
    return this.userService.sendEmail(data);
  }
  @Post('verifyEmail')
  verify(@Body() data: otpDto) {
    return this.userService.verifyEmail(data);
  }
  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    const userId = req['user-id'];

    return this.userService.me(userId);
  }
  @Post('refreshToken')
  async refreshToken(@Body() data: RefreshTokendDto) {
    return this.userService.refresh(data);
  }
  @Rolee(adminRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query: UserQueryDto) {
    return this.userService.findAll(query);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  @Rolee(adminRole.ADMIN, adminRole.SUPER_ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
  @Rolee(adminRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    const userId = req['user-id'];
    return this.userService.changePassword(userId, dto);
  }
  @Rolee(adminRole.ADMIN, userRole.SUPER_ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post('add/admin')
  async CreateAdmin(@Body() data: CreateAdminDto) {
    return this.userService.createAdmin(data);
  }
  @UseGuards(AuthGuard)
  @Delete('admin/:id')
  async deleteAdmin(@Param('id') id: string, @Req() req: Request) {
    const currentUserId = req['user-id'];
    return this.userService.deleteAdmin(id, currentUserId);
  }
}
