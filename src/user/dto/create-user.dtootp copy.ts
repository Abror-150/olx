import { ApiProperty } from '@nestjs/swagger';

export class otpDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  otp: string;
}
