import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from './../../auth/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from './../../auth/entities/role.enum';
import { config as dotenvConfig } from 'dotenv';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    // factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query('TRUNCATE TABLE "users" CASCADE;');
    await dataSource.query('ALTER SEQUENCE users_id_seq RESTART WITH 1;');
    await dataSource.query("UPDATE users SET id=nextval('users_id_seq');");

    dotenvConfig({ path: `.env.${process.env.NODE_ENV}.local` });

    const repository = dataSource.getRepository(User);

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await repository.insert([
      {
        username: process.env.ADMIN_USERNAME,
        email: '',
        password: hashedPassword,
        firstName: '',
        lastName: '',
        role: Role.ADMIN,
      },
    ]);
  }
}
