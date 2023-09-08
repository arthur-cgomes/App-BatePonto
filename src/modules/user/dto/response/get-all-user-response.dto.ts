import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entity/user.entity';
import { UserDto } from './user.dto';

export class GetAllUsersResponseDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  skip: number;

  @ApiProperty({ type: UserDto, isArray: true })
  users: User[];
}
