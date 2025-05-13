// src/product/dto/create-product.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type as Type, productStatus } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsInt,
  Min,
  IsOptional,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  IsUrl,
  Max,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Smartphone X', description: 'Mahsulot nomi' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '5f74c8d2-3db2-4f88-b6a4-fc2b4e7cfa23',
    description: 'Category ID',
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: 999, description: 'Mahsulot narxi (butun son)' })
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 'https://example.com/img.png',
    description: 'Mahsulot rasmi URL',
  })
  @IsString()
  @IsUrl()
  img: string;

  @ApiProperty({
    enum: productStatus,
    example: productStatus.NEW,
    description: 'Mahsulot statusi',
  })
  @IsEnum(productStatus)
  status: productStatus;

  @ApiProperty({
    enum: Type,
    example: Type.Phone,
    description: 'Mahsulot turi',
  })
  @IsEnum(Type)
  type: Type;

  @ApiPropertyOptional({ example: 10, description: 'Chegirma foizi (0–100)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  discount?: number;

  @ApiProperty({
    example: 'Yangi model, 64GB hafiza, 4GB RAM',
    description: 'Mahsulot taʼriflari',
  })
  @IsString()
  @IsNotEmpty()
  describtion: string;

  @ApiPropertyOptional({
    example: ['color-id-1', 'color-id-2'],
    description: 'Mahsulotga tegishli ranglar IDlari',
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  colorIds?: string[];
}
