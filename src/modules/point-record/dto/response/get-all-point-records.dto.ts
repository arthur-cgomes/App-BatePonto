import { ApiProperty } from '@nestjs/swagger';
import { PointRecordDto } from './point-record.dto';
import { PointRecord } from '../../entity/point-record.entity';

export class GetAllPointRecordsResponseDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  skip: number;

  @ApiProperty({ type: PointRecordDto, isArray: true })
  pointRecords: PointRecord[];
}
