import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class chatMessageDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  toId: string;
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  chatId: string;
  @ApiProperty()
  @IsString()
  text: string;
}
