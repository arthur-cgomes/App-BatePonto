import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  birthDate: Date;

  @ApiProperty()
  @IsOptional()
  phone: string;
}
