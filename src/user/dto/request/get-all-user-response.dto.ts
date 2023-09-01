import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../user/entity/user.entity';
import { UserDto } from '../response/user.dto';

export class GetAllUsersResponseDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  skip: number;

  @ApiProperty({ type: UserDto, isArray: true })
  users: User[];
}
