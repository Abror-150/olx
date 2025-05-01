import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Ip,
  NotFoundException,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserLoginDto } from './dto/create-user.dtoLogin. copy';
import { totp } from 'otplib';
import { otpDto } from './dto/create-user.dtootp copy';
import { emailDto } from './dto/createEmaildto';
import { MailService } from 'src/mail/mail.service';
import { log } from 'console';
import { connect } from 'http2';
import { ChangePasswordDto } from './dto/changed.user.dto';
import { Prisma } from '@prisma/client';
import { UserQueryDto } from './dto/changed.user.Query.dto copy';
import { Request } from 'express';
import { RefreshTokendDto } from './dto/changed.user.dtoRefresh';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mail: MailService,
  ) {}

  async sendEmail(data: emailDto) {
    try {
      let { email } = data;

      let otp = totp.generate(email + 'email');
      await this.mail.sendEmail(email, otp, 'otp yuborildi');
      let e = 'emailga yuborildi';
      return { e };
    } catch (error) {
      return error;
    }
  }
  async verifyEmail(data: otpDto) {
    try {
      let { email, otp } = data;
      if (!email) {
        throw new NotFoundException('email not found ');
      }

      let match = totp.verify({ token: otp, secret: email + 'email' });
      if (!match) {
        console.log(match);
        throw new BadRequestException('otp not valid');
      }

      return match;
    } catch (error) {
      return error;
    }
  }

  async register(data: CreateUserDto) {
    let { email, password } = data;
    try {
      let user = await this.prisma.user.findFirst({ where: { email } });
      if (user) {
        throw new BadRequestException('user already exists');
      }
      let hash = bcrypt.hashSync(password, 10);
      let newUser = await this.prisma.user.create({
        data: {
          email,
          password: hash,
          firstName: data.firstName,
          lastName: data.lastName,
          regionId: data.regionId,
          role: data.role,
          year: data.year,
          img: data.img,
        },
      });
      return newUser;
    } catch (error) {
      return error;
    }
  }

  async login(data: CreateUserLoginDto, req: Request) {
    try {
      let { email } = data;
      let user = await this.prisma.user.findFirst({ where: { email } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      let match = bcrypt.compareSync(data.password, user.password);
      if (!match) {
        throw new UnauthorizedException('Incorrect password');
      }

      let device = req.headers['user-agent'] as string;
      let ip = req.ip as string;

      let userSession = await this.prisma.sesion.findFirst({
        where: { userId: user.id },
      });

      let session = await this.prisma.sesion.findFirst({ where: { ip } });
      if (!userSession || !session) {
        await this.prisma.sesion.create({
          data: {
            ip: ip,
            device: device,
            user: {
              connect: { id: user.id },
            },
          },
        });
      }

      let acces_token = this.jwt.sign({ id: user.id, role: user.role });
      let refresh_token = this.jwt.sign({ id: user.id, role: user.role });
      return { acces_token, refresh_token };
    } catch (error) {
      return error;
    }
  }
  async refresh(data: RefreshTokendDto) {
    try {
      let user = this.jwt.verify(data.refreshToken);

      const newAccestoken = this.jwt.sign({ id: user.id, role: user.role });
      return { newAccestoken };
    } catch (error) {
      throw new InternalServerErrorException('internal server error');
    }
  }
  async me(userId: string) {
    try {
      const userr = await this.prisma.user.findFirst({
        where: { id: userId },

        include: { sesion: true },
      });

      if (!userr) {
        console.log('not');

        throw new NotFoundException('Foydalanuvchi topilmadi');
      }

      return userr;
    } catch (error) {
      throw new BadRequestException(
        'Foydalanuvchi ma’lumotlarini olishda xatolik',
      );
    }
  }
  async findAll(query: UserQueryDto) {
    const {
      search,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = query;

    let where: any = {};

    if (search) {
      where.firstName = { contains: search, mode: 'insensitive' };
    }

    const validSortByFields = ['name', 'createdAt', 'updatedAt'];
    if (!validSortByFields.includes(sortBy)) {
      throw new Error('Invalid sortBy field');
    }

    try {
      const users = await this.prisma.user.findMany({
        where,
        orderBy: sortBy ? { [sortBy]: order } : undefined,
        skip: (page - 1) * limit,
        take: Number(limit),
      });

      const total = await this.prisma.user.count({ where });

      return { total, page, limit, users };
    } catch (error) {
      console.error('Error in findAll method:', error);
      throw new Error('An error occurred while fetching users');
    }
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Eski parol noto‘g‘ri');
    }

    const hashedNewPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Parol muvaffaqiyatli o‘zgartirildi' };
  }

  async findOne(id: string) {
    const data = await this.prisma.region.findFirst({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException('user not found');
    }
    return data;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userr = await this.prisma.user.findFirst({ where: { id } });

    if (!userr) {
      throw new NotFoundException(`user with ID "${id}" not found`);
    }
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    return user;
  }

  async remove(id: string) {
    const userr = await this.prisma.user.findFirst({ where: { id } });

    if (!userr) {
      throw new NotFoundException(`user with ID "${id}" not found`);
    }
    await this.prisma.user.delete({
      where: { id },
    });
    return { message: `User with id ${id} has been deleted` };
  }
}
