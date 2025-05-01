import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Max, Min } from 'class-validator';

export class CreateColorDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 15, {
    message: 'name must be between 3 and 15 characters',
  })
  @ApiProperty()
  name: string;
}
