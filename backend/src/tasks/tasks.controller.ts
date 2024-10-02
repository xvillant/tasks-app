import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuardJwt } from './../auth/guards/jwt.guard';
import { CurrentUser } from './../auth/current-user.decorator';
import { User } from './../auth/entities/user.entity';
import { Task } from './entities/task.entity';
import {
  Pagination,
  PaginationParams,
} from './../shared/decorators/pagintation-params.decorator';
import {
  Sorting,
  SortingParams,
} from './../shared/decorators/sorting-params.decorator';
import {
  Filtering,
  FilteringParams,
} from './../shared/decorators/filtering-params.decorator';
import { PaginatedResource } from './../shared/dto/paginated-resource.dto';
import { RoleGuard } from './../auth/guards/role.guard';
import { Roles } from './../auth/roles.decorator';
import { Role } from './../auth/entities/role.enum';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(AuthGuardJwt)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: User,
  ): Promise<Task> {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @PaginationParams() paginationParams: Pagination,
    @SortingParams(['title', 'createdAt', 'updatedAt', 'completedAt'])
    sort?: Sorting,
    @FilteringParams([
      'title',
      'description',
      'createdAt',
      'updatedAt',
      'completedAt',
    ])
    filter?: Filtering,
  ): Promise<PaginatedResource<Task>> {
    return this.tasksService.findAll(paginationParams, sort, filter);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt, RoleGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.remove(id, user);
  }

  @Patch(':id/complete')
  @UseGuards(AuthGuardJwt)
  @HttpCode(HttpStatus.OK)
  toggleComplete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.toggleComplete(id, user);
  }

  @Get('/user/:id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(HttpStatus.OK)
  findAllByUserId(@Param('id', ParseIntPipe) id: number): Promise<Task[]> {
    return this.tasksService.findAllByUserId(id);
  }
}
