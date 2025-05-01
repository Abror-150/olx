import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateViewDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  productId: string;
}
