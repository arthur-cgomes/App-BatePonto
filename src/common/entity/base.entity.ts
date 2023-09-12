import {
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseCollection extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ApiProperty({ type: Date })
  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: string;

  @ApiProperty({ type: Date })
  @UpdateDateColumn({
    type: 'timestamp',
    select: false,
  })
  updatedAt: string;
}
