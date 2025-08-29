import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'password123', minLength: 4, maxLength: 15 })
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'password123', minLength: 4, maxLength: 15 })
  password: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;
}
