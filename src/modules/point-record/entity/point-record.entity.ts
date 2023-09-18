import { ApiProperty } from '@nestjs/swagger';
import { BaseCollection } from '../../../common/entity/base.entity';
import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../../modules/user/entity/user.entity';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @IsDate()
  dateTime: Date;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ManyToOne(() => User, (user) => user.pointRecords)
  user: User;

  constructor() {
    super();
    this.dateTime = new Date();
  }

  @BeforeInsert()
  formatarDataHora() {
    const dataHoraFormatada = `${this.dateTime.toISOString().split('T')[0]} ${this.dateTime.toLocaleTimeString()}`;
    this.dateTime = new Date(dataHoraFormatada);
  }
}
