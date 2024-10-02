import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Role } from '../entities/role.enum';

export class AuthResponse {
  @IsNumber()
  @Expose()
  userId: number;
  @IsString()
  @Expose()
  token: string;
  @IsEnum(Role)
  @Expose()
  role: Role;
}
