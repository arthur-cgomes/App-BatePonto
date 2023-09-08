import { Module } from '@nestjs/common';
import { AppDataSource } from './datasource';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserTypeModule } from './modules/user-type/user-type.module';

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
