import { Module } from '@nestjs/common';
import { PointRecordService } from './point-record.service';
import { PointRecordController } from './point-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointRecord } from './entity/point-record.entity';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PointRecord]), UserModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
  ],
  controllers: [PointRecordController],
  providers: [PointRecordService],
  exports: [PointRecordService],
})
export class PointRecordModule {}