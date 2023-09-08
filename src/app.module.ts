import { Module } from '@nestjs/common';
import { AppDataSource } from './datasource';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { UserTypeModule } from './modules/user-type/user-type.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UserModule,
    AuthModule,
    UserTypeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
