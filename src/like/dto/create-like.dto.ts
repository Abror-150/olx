import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty({
    description: 'Loyihaga like bosiladigan mahsulotning UUID formatdagi ID si',
    example: 'e9a1b17a-1c2e-4b1e-a6ff-4b4f7b7a8b3f',
  })
  @IsNotEmpty({ message: 'productId bo‘sh bo‘lmasligi kerak' })
  @IsUUID('4', { message: 'productId noto‘g‘ri UUID formatda' })
  productId: string;
}
