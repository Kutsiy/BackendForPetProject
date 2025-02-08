import { SetMetadata } from '@nestjs/common';

export const RolesSetter = (roles: string[]) => SetMetadata('roles', roles);
