import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { SeederOptions } from 'typeorm-extension';

dotenvConfig({ path: `.env.${process.env.NODE_ENV}` });

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  synchronize: configService.get('DB_SYNC') === 'true',
  host: configService.get('DB_HOST'),
  username: configService.get('DB_USERNAME'),
  port: parseInt(configService.get('DB_PORT')),
  database: configService.get('DB_NAME'),
  password: configService.get('DB_PASSWORD'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: '__migrations',

  seeds: ['dist/src/db/seeds/**/*{.js,.ts}'],
  // factories: ['dist/db/factories/**/*{.js,.ts}'],
};

export default new DataSource(dataSourceOptions);
