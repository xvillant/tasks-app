import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { Pagination } from './../shared/decorators/pagintation-params.decorator';
import { PaginatedResource } from './../shared/dto/paginated-resource.dto';
import { Filtering } from './../shared/decorators/filtering-params.decorator';
import { Sorting } from './../shared/decorators/sorting-params.decorator';
import { getOrder, getWhere } from 'src/shared/typeorm.helpers';
import { User } from './../auth/entities/user.entity';
import { Role } from 'src/auth/entities/role.enum';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User) {
    const task = new Task({
      ...createTaskDto,
      completed: false,
      completedAt: null,
      user,
    });
    return await this.tasksRepository.save(task);
  }

  async findAll(
    { page, limit, size, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<PaginatedResource<Task>> {
    // https://dev.to/kogab/how-to-create-paginated-sortable-and-filterable-endpoints-with-nestjs-4bom
    const where = getWhere(filter);
    const order = getOrder(sort);

    const [tasks, total] = await this.tasksRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: offset,
      relations: ['user'],
    });

    const last = Math.max(Math.ceil(total / limit) - 1, 0);

    return {
      total,
      data: tasks,
      page,
      size,
      last,
    };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundException(`Recipe with id ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: User) {
    let task = await this.findOne(id);

    if (task.userId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You are not authorized to change this task',
      );
    }

    task = { ...task, ...updateTaskDto };

    return await this.tasksRepository.save(task);
  }

  async remove(id: string, user: User) {
    const task = await this.findOne(id);

    if (task.userId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You are not authorized to change this task',
      );
    }

    return await this.tasksRepository.remove(task);
  }

  async toggleComplete(id: string, user: User) {
    let task = await this.findOne(id);

    if (task.userId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You are not authorized to change this task',
      );
    }

    const previousCompleted = task.completed;

    task = {
      ...task,
      completedAt: previousCompleted ? null : new Date(),
      completed: !previousCompleted,
    };

    return await this.tasksRepository.save(task);
  }

  async findAllByUsername(username: string): Promise<Task[]> {
    const tasks = await this.tasksRepository.find({
      where: { user: { username } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    return tasks;
  }
}
