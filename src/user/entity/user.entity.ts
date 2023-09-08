import { ApiProperty } from '@nestjs/swagger';
import { BaseCollection } from '../../common/entity/base.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, Unique } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['email'])
export class User extends BaseCollection {
  @ApiProperty()
  @Column()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Column({ default: null, select: false })
  password: string;

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
  hashPassword() {
    if (
      this.password &&
      this.password !== undefined &&
      this.password !== null
    ) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }

  checkPassword = (attempt: string) => {
    if (!this.password) return false;
    return bcrypt.compareSync(attempt, this.password);
  };

  @BeforeInsert()
  @BeforeUpdate()
  format = () => {
    if (this.phone) this.phone = this.phone.replace(/[^\d]+/g, '');
  };
}
