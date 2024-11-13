import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserResponseDto } from './dto/create-user.response.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':username')
  @HttpCode(HttpStatus.OK)
  async findOneByUsername(@Param('username') username: string) {
    return this.usersService.findOneByUsername(username);
  }

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    return this.usersService.create(createUserDto);
  }
}
