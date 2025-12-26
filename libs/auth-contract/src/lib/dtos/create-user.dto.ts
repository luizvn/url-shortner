import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';
import { AuthProvider } from '../enums/auth-provider.enum.js';
import { Role } from '../enums/role.enum.js';
import { Status } from '../enums/status.enum.js';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @IsEnum(Role)
  @IsOptional()
  @ApiProperty({ example: Role.USER })
  role?: Role;

  @IsEnum(Status)
  @IsOptional()
  @ApiProperty({ example: Status.ACTIVE })
  status?: Status;

  @IsEnum(AuthProvider)
  @IsOptional()
  @ApiProperty({ example: AuthProvider.LOCAL })
  authProvider?: AuthProvider;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'John Doe' })
  name?: string;

  @ValidateIf((o) => o.authProvider === AuthProvider.GOOGLE)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  googleId?: string;

  @ValidateIf((o) => o.authProvider === AuthProvider.LOCAL)
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @ApiProperty({ example: 'password' })
  password?: string;
}
