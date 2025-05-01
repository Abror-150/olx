import { ApiProperty } from '@nestjs/swagger';
import { userRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsInt,
  Min,
  MaxLength,
  Max,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Ali', description: 'Foydalanuvchining ismi' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @ApiProperty({
    example: 'Valiyev',
    description: 'Foydalanuvchining familiyasi',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @ApiProperty({
    example: 'ali@example.com',
    description: 'Foydalanuvchining email manzili',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'Foydalanuvchining paroli',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'password must not be less than 6' })
  @MaxLength(16, { message: 'password must not be greater than 16' })
  password: string;

  @ApiProperty({
    example: '5f74c8d2-3db2-4f88-b6a4-fc2b4e7cfa23',
    description: 'Region IDsi',
  })
  @IsUUID()
  @IsNotEmpty()
  regionId: string;

  @ApiProperty({
    enum: userRole,
    example: userRole.USER,
    description: 'Foydalanuvchi roli',
  })
  @IsEnum(userRole)
  role: userRole;

  @ApiProperty({
    example: 2000,
    description: 'Foydalanuvchining tug‘ilgan yili',
  })
  @IsInt()
  @Min(1900)
  year: number;

  @ApiProperty({
    example: 'https://example.com/photo.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  img?: string;
}
