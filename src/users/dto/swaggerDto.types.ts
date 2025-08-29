import { ApiProperty } from '@nestjs/swagger';
import { ROLES } from 'src/enums/role.enum';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: false })
  isBlock: boolean;

  @ApiProperty({ enum: ROLES, example: ROLES.USER })
  role: ROLES;
}

export class UpdateUserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Jane Doe', required: false })
  name?: string;

  @ApiProperty({ example: 'jane@example.com', required: false })
  email?: string;
}

export class BlockUserDto {
  @ApiProperty({ example: 5 })
  id: number;
}
