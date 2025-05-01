import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @IsString()
  @Length(6, 16, {
    message: 'Yangi parol 6 tadan kam va 16 tadan ko‘p bo‘lmasligi kerak',
  })
  newPassword: string;
}
