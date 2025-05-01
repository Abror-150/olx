import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateChatDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  fromId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  toId: string;
}
