import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserTypeEnum } from '../../entity/user.entity';

export class UpdateUserTypeDto {
  @ApiProperty()
  @IsNotEmpty()
  userType: UserTypeEnum;
}
