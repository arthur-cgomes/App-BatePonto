import { ApiProperty } from '@nestjs/swagger';
import { BaseCollection } from '../../../common/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../../modules/user/entity/user.entity';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum PointRecordEnum {
  PROHIBITED = 'prohibited',
  BREAK = 'break',
  RETURN = 'return',
  EXIT = 'exit',
}

export enum PointRecordJustificationEnum {
  ADJUST_TIME = 'adjust_time',
  CERTIFICATE = 'certificate',
  DELAY = 'delay',
  LACK = 'lack',
  HOLIDAY = 'holiday',
  VACATION = 'vacation',
  DAY_OFF = 'day_off',
  RECORD = 'record',
}

@Entity()
export class PointRecord extends BaseCollection {
  @ApiProperty()
  @Column({
    type: 'enum',
    enum: PointRecordEnum,
    default: PointRecordEnum.PROHIBITED,
  })
  @IsNotEmpty()
  @IsEnum(PointRecordEnum)
  pointRecordType: PointRecordEnum;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: PointRecordJustificationEnum,
    default: PointRecordJustificationEnum.RECORD,
  })
  @IsOptional()
  @IsEnum(PointRecordJustificationEnum)
  justificationType: PointRecordJustificationEnum;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ManyToOne(() => User, (user) => user.pointRecords)
  user: User;
}
