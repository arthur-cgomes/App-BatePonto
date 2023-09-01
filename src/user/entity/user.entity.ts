import { ApiProperty } from '@nestjs/swagger';
import { BaseCollection } from 'src/common/entity/base.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, Unique } from 'typeorm';
import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

@Entity()
@Unique(['email'])
export class User extends BaseCollection {
  @ApiProperty()
  @Column()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Column({ length: 150 })
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Column({ length: 14 })
  @IsNotEmpty()
  cpf: string;

  @ApiProperty()
  @Column({ type: 'date' })
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
