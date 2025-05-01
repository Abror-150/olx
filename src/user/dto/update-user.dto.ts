import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Ali', description: 'Yangi ism' })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Valiyev', description: 'Yangi familiya' })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  lastName?: string;

  @ApiPropertyOptional({
    example: 'ali@example.com',
    description: 'Yangi email',
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}
