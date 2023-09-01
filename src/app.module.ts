import { Module } from '@nestjs/common';
import { AppDataSource } from './datasource';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options), UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
