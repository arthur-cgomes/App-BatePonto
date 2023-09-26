import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  PointRecordEnum,
  PointRecordJustificationEnum,
} from '../../entity/point-record.entity';

export class UpdatePointRecordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  pointRecordId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(PointRecordEnum)
  pointRecordType: PointRecordEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(PointRecordJustificationEnum)
  justificationType: PointRecordJustificationEnum;
}
