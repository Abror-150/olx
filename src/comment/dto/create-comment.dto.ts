import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Great product!', description: 'Comment text' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 500, { message: 'message must be between 1 and 500 characters' })
  message: string;

  @ApiProperty({
    example: '6a84e8d2-7cb3-4f99-c6a5-dd3b5e7dfa34',
    description: 'Product ID',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiPropertyOptional({ example: 4, description: 'Rating (0-5)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  star?: number;
}

export class UpdateCommentDto {
  @ApiPropertyOptional({
    example: 'Updated comment',
    description: 'Comment text',
  })
  @IsOptional()
  @IsString()
  @Length(1, 500, { message: 'message must be between 1 and 500 characters' })
  message?: string;

  @ApiPropertyOptional({ example: 5, description: 'Rating (0-5)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  star?: number;
}
