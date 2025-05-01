import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  isEmpty,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class emailDto {
  @IsNotEmpty({ message: "Email maydoni bo'sh bo'lishi mumkin emas" })
  @IsEmail({}, { message: "Iltimos, to'g'ri email manzilini kiriting" })
  @ApiProperty()
  email: string;
}
