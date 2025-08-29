import { ApiProperty } from '@nestjs/swagger';

export class CreateUpdateNoteDto {
  @ApiProperty({ example: 'Shopping list', description: 'Title of the note' })
  title: string;

  @ApiProperty({ example: 'Buy milk, bread, eggs', description: 'Content of the note' })
  description: string;
}

export class NoteResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Shopping list' })
  title: string;

  @ApiProperty({ example: 'Buy milk, bread, eggs' })
  description: string;

  @ApiProperty({ example: 5 })
  userId: number;
}
