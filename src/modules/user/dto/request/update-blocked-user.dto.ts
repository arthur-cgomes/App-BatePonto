import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateBlockedUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  userIds: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  blockedUser: boolean;
}
