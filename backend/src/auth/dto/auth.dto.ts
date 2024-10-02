import { IsNotEmpty, IsString, Length } from 'class-validator';
export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @Length(5)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  password: string;
}
