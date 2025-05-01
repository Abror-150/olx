import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Mahsulotning tasviri uchun rasm URL manzili',
    example: 'https://example.com/product-image.jpg',
  })
  @IsUrl({}, { message: 'Img must be a valid URL' })
  img: string;

  @ApiProperty({
    description: 'Mahsulot soni',
    example: 2,
  })
  @IsInt({ message: 'Count must be an integer' })
  @Min(1, { message: 'Count must be at least 1' })
  count: number;

  @ApiProperty({
    description: 'Mahsulot rangi uchun ID',
    example: 'c1d1b68d-79a9-4be4-8556-9f02a28cd580',
  })
  @IsUUID('4', { message: 'colorId must be a valid UUID' })
  @IsNotEmpty()
  colorId: string;

  @ApiProperty({
    description: 'Mahsulot ID',
    example: 'f2d45678-32ad-4a34-8ad4-e4e83740fd57',
  })
  @IsNotEmpty()
  @IsUUID('4', { message: 'productId must be a valid UUID' })
  productId: string;
}
