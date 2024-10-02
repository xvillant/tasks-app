import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { Role } from '../entities/role.enum';

export class CreateUserResponseDto {
  constructor(partial: Partial<CreateUserResponseDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  id: number;

  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  firstName: string;

  @Expose()
  @IsString()
  lastName: string;

  @Expose()
  @IsEnum(Role)
  role: Role;

  @Expose()
  @IsString()
  token: string;
}
