import { ApiProperty } from '@nestjs/swagger';
import { Type as CategoryType } from '@prisma/client';
import { IsString, IsNotEmpty, IsUrl, IsEnum } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Electronics',
    description: 'Kategoriya nomi',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'Kategoriya rasmi (URL)',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  img: string;

  @ApiProperty({
    example: CategoryType.Electronics,
    enum: CategoryType,
    description: 'Kategoriya turi',
  })
  @IsEnum(CategoryType)
  type: CategoryType;
}
