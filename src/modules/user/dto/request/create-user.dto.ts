import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { UserTypeEnum } from '../../entity/user.entity';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty()
  @IsOptional()
  birthDate: Date;

  @ApiProperty()
  @IsOptional()
  phone: string;

  @ApiProperty({ enum: UserTypeEnum })
  @IsEnum(UserTypeEnum)
  @IsNotEmpty()
  userType: UserTypeEnum;
}
