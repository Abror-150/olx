import { ApiProperty } from '@nestjs/swagger';
import { userRole } from '@prisma/client';

export class CreateUserLoginDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
