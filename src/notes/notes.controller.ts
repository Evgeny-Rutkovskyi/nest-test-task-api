import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards, UsePipes } from '@nestjs/common';
import { NotesService } from './notes.service';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { createUpdateNotesSchema, CreateUpdateNotesZodDto } from './dto/CreateUpdateNotesZod.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUpdateNoteDto, NoteResponseDto } from './dto/swaggerDto.types';

@ApiTags('notes')
@ApiBearerAuth()
@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
    constructor(private readonly notesService: NotesService) {}

    @Post('/create')
    @ApiOperation({ summary: 'Create a new note' })
    @ApiBody({ type: CreateUpdateNoteDto })
    @ApiResponse({ status: 201, description: 'Note created', type: NoteResponseDto })
    @UsePipes(new ZodValidationPipe(createUpdateNotesSchema))
    async create(@Req() req, @Body() dto: CreateUpdateNotesZodDto) {
        return await this.notesService.createNote(req.user, dto);
    }

    @Get('/all')
    @ApiOperation({ summary: 'Get all notes (admin gets all, user only own)' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiResponse({ status: 200, description: 'List of notes', type: [NoteResponseDto] })
    async getAll(
        @Req() req,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return await this.notesService.getAllNotes(
            req.user,
            page ? Number(page) : 1,
            limit ? Number(limit) : 10,
        );
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get note by id' })
    @ApiResponse({ status: 200, description: 'Note found', type: NoteResponseDto })
    @ApiResponse({ status: 404, description: 'Note not found' })
    async getById(@Req() req, @Param('id', ParseIntPipe) id: number) {
        return await this.notesService.getNoteById(req.user, id);
    }

    @Patch('/:id')
    @UsePipes(new ZodValidationPipe(createUpdateNotesSchema))
    @ApiOperation({ summary: 'Update note by id' })
    @ApiBody({ type: CreateUpdateNoteDto })
    @ApiResponse({ status: 200, description: 'Note updated', type: NoteResponseDto })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Note not found' })
    async update(
        @Req() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CreateUpdateNotesZodDto,
    ) {
        return await this.notesService.updateNote(req.user, id, dto);
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete note by id' })
    @ApiResponse({ status: 200, description: 'Note deleted', type: NoteResponseDto })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Note not found' })
    async delete(@Req() req, @Param('id', ParseIntPipe) id: number) {
        return await this.notesService.deleteNote(req.user, id);
    }
}
