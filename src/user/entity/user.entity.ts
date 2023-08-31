import { ApiProperty } from '@nestjs/swagger';
import { BaseCollection } from 'src/common/entity/base.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, Unique } from 'typeorm';
import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

@Entity()
@Unique(['externalId', 'email'])
export class User extends BaseCollection {
  @ApiProperty()
  @Column()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Column({ length: 150 })
  @IsUUID()
  externalId: string;

  @ApiProperty()
  @Column({ length: 150 })
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Column({ type: 'timestamp' })
  @IsNotEmpty()
  birthDate: Date;

  @ApiProperty()
  @Column({ length: 20 })
  @IsNotEmpty()
  phone: string;

  @BeforeInsert()
  @BeforeUpdate()
  format = () => {
    if (this.phone) this.phone = this.phone.replace(/[^\d]+/g, '');
  };
}
