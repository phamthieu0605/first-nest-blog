import {
  IsEmail,
  IsLowercase,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email must be in the correct format',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password must be at least 6 characters',
  })
  @MinLength(6)
  password: string;
}

export class RegisterDto extends LoginDto {
  @ApiProperty()
  @IsLowercase()
  @IsString()
  username: string;
}

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  username: string;

  @ApiProperty()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsOptional()
  image: string;
}
export interface AuthPayload {
  username: string;
}
