import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsInt,
  Min,
  MaxLength,
  Max,
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { userRole } from '@prisma/client';

@ValidatorConstraint({ name: 'IsAllowedRole', async: false })
export class IsAllowedRole implements ValidatorConstraintInterface {
  validate(role: any, args: ValidationArguments) {
    return [userRole.USER].includes(role);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Foydalanuvchi roli faqat USER ';
  }
}
