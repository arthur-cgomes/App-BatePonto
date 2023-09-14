import { ApiProperty } from '@nestjs/swagger';
import { BaseCollection } from '../../../common/entity/base.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, Unique } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcrypt';

export enum UserTypeEnum {
  SUPER_ADMIN = 'super_admin',
  COMPANY_ADMIN = 'company_admin',
  TEAM_ADMIN = 'team_admin',
  COLLABORATOR = 'collaborator',
  FREE_TRIAL = 'free_trial',
}

@Entity()
@Unique(['email', 'cpf'])
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

  @ApiProperty()
  @Column({ type: 'bool', name: 'blockedUser', default: false })
  @IsNotEmpty()
  blockedUser: boolean;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: UserTypeEnum,
    default: UserTypeEnum.FREE_TRIAL,
  })
  @IsNotEmpty()
  userType: UserTypeEnum;

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
