import { ApiProperty } from '@nestjs/swagger';

export class chatMessageDto {
  @ApiProperty()
  fromId: string;
  @ApiProperty()
  toId: string;
  @ApiProperty()
  chatId: string;
  @ApiProperty()
  text: string;
}
