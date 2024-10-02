import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { User } from './entities/user.entity';
import { AuthGuardLocal } from './guards/local.guard';
import { AuthGuardJwt } from './guards/jwt.guard';
import { AuthResponse } from './dto/auth.response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuardLocal)
  @HttpCode(HttpStatus.OK)
  async login(@CurrentUser() user: User): Promise<AuthResponse> {
    return {
      userId: user.id,
      role: user.role,
      token: this.authService.getTokenForUser(user),
    };
  }

  @Get('me')
  @UseGuards(AuthGuardJwt)
  @HttpCode(HttpStatus.OK)
  async getProfile(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
