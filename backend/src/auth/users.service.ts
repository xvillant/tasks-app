import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { CreateUserResponseDto } from './dto/create-user.response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.retypedPassword) {
      throw new BadRequestException('Passwords are not identical');
    }

    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new BadRequestException('Username or email is already taken');
    }

    delete createUserDto['retypedPassword'];

    const user = new User({
      ...createUserDto,
      password: await this.authService.hashPassword(createUserDto.password),
    });

    const savedUser = await this.usersRepository.save(user);

    return new CreateUserResponseDto({
      id: savedUser.id,
      username: savedUser.username,
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      role: savedUser.role,
      token: this.authService.getTokenForUser(savedUser),
    });
  }

  async findOneByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }
}
