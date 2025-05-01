import { SetMetadata } from '@nestjs/common';
import { userRole } from '@prisma/client';

export const ROLES_KEY = 'roles';

export const Rolee = (...roles: userRole[]) => SetMetadata(ROLES_KEY, roles);
