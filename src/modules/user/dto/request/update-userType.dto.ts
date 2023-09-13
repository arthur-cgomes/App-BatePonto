import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { UserTypeEnum } from '../../entity/user.entity';

export class UpdateUserTypeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  userIds: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UserTypeEnum)
  userType: UserTypeEnum;
}
