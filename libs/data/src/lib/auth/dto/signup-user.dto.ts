import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Min } from 'class-validator';

export class SignupUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Min(2)
  firstName: string;

  @ApiProperty()
  @Min(2)
  lastName: string;

  @ApiProperty()
  @Min(8)
  password: string;
}
