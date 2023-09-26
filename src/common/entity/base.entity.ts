import {
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export abstract class BaseCollection extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ApiProperty({ type: Date })
  @CreateDateColumn({
    type: 'timestamp',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ type: Date })
  @UpdateDateColumn({
    type: 'timestamp',
    select: false,
  })
  @IsDate()
  updatedAt: Date;
}
