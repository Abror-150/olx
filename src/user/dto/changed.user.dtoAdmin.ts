import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { adminRole } from '../adminRole/adminrole.enum';

export class CreateAdminDto {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  @MaxLength(18)
  password: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  regionId: string;

  @ApiProperty()
  @IsEnum(adminRole)
  role: adminRole;
  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  img?: string;
}
