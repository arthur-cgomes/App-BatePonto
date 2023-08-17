import * as path from 'path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.TYPEORM_HOST || 'localhost',
  port: Number(process.env.TYPEORM_PORT || 5438),
  username: process.env.TYPEORM_USERNAME || 'postgres',
  password: process.env.TYPEORM_PASSWORD || 'postgres',
  database: process.env.TYPEORM_DATABASE || 'bateponto_db',
  synchronize: false,
  migrations: [path.join(__dirname, '/migrations/*{.ts,.js}')],
  migrationsRun: true,
  migrationsTableName: 'migrations',
  entities: [`${__dirname}/**/*.entity{.ts,.js}`],
});
