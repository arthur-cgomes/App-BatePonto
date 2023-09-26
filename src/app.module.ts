import { Module } from '@nestjs/common';
import { AppDataSource } from './datasource';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PointRecordModule } from './modules/point-record/point-record.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UserModule,
    AuthModule,
    PointRecordModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
