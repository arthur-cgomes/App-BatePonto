import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PointRecordEnum } from '../../entity/point-record.entity';

export class CreatePointRecordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(PointRecordEnum)
  pointRecordType: PointRecordEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;
}
