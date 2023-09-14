import { OmitType } from '@nestjs/swagger';
import { PointRecord } from '../../entity/point-record.entity';

export class PointRecordDto extends OmitType(PointRecord, ['user']) {}
