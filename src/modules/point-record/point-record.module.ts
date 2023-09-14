import { Module } from '@nestjs/common';
import { PointRecordService } from './point-record.service';
import { PointRecordController } from './point-record.controller';

@Module({
  providers: [PointRecordService],
  controllers: [PointRecordController],
})
export class PointRecordModule {}
