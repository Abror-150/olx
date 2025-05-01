import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateRegionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'toshkent' })
  name: string;
}
