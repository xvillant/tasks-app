import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(5)
  @IsNotEmpty()
  username: string;
  @IsString()
  @Length(8)
  @IsNotEmpty()
  password: string;
  @IsString()
  @Length(8)
  @IsNotEmpty()
  retypedPassword: string;
  @IsString()
  @Length(2)
  @IsNotEmpty()
  firstName: string;
  @IsString()
  @Length(2)
  @IsNotEmpty()
  lastName: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
