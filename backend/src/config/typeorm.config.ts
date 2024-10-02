import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeormConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    type: 'postgres',
    autoLoadEntities: true,
    synchronize: configService.get('DB_SYNC') === 'true',
    host: configService.get('DB_HOST'),
    username: configService.get('DB_USERNAME'),
    port: parseInt(configService.get('DB_PORT')),
    database: configService.get('DB_NAME'),
    password: configService.get('DB_PASSWORD'),
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['/migrations/*{.ts,.js}'],
    migrationsTableName: '__migrations',
  }),
};
