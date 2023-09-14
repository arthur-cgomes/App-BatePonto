import { ApiProperty } from '@nestjs/swagger';
import { BaseCollection } from '../../../common/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../../modules/user/entity/user.entity';
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum PointRecordEnum {
  PROHIBITED = 'prohibited',
  BREAK = 'break',
  RETURN = 'return',
  EXIT = 'exit',
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
  @Column()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty()
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @IsNotEmpty()
  @IsDate()
  dateTime: Date;

  @ManyToOne(() => User, (user) => user.pointRecords)
  user: User;
}
