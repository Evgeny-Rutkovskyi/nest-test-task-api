import { ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DrizzleDB } from 'src/drizzle/types/drizzle.type';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { notes } from 'src/drizzle/schema/notes.schema';
import { eq } from 'drizzle-orm';
import { ROLES } from 'src/enums/role.enum';
import { CreateUpdateNotesZodDto } from './dto/CreateUpdateNotesZod.dto';
import { Payload } from 'src/types/payload.type';

@Injectable()
export class NotesService {
    private readonly logger = new Logger(NotesService.name);

    constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

    async createNote(currentUser: Payload, dto: CreateUpdateNotesZodDto) {
        try {
            const [newNote] = await this.db.insert(notes).values({
                title: dto.title,
                description: dto.description,
                userId: currentUser.userId,
            }).returning();

            this.logger.log(`User id=${currentUser.userId} created note id=${newNote.id}`);
            return newNote;
        } catch (error) {
            this.logger.error('Error creating note', error.stack);
            throw error;
        }
    }

    async getAllNotes(currentUser: Payload, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            let query;

            if (currentUser.role === ROLES.ADMIN) {
                query = this.db.select().from(notes).limit(limit).offset(offset);
            } else {
                query = this.db.select().from(notes).where(eq(notes.userId, currentUser.userId)).limit(limit).offset(offset);
            }

            this.logger.log(`User id=${currentUser.userId} fetched notes page=${page} limit=${limit}`);
            return query;
        } catch (error) {
            this.logger.error('Error fetching notes', error.stack);
            throw error;
        }
    }

    async getNoteById(currentUser: Payload, id: number) {
        try {
            const [note] = await this.db.select().from(notes).where(eq(notes.id, id));
            if (!note) throw new NotFoundException('Note not found');
            if (currentUser.role !== ROLES.ADMIN && note.userId !== currentUser.userId) {
                throw new ForbiddenException('You cannot access this note');
            }
            this.logger.log(`User id=${currentUser.userId} fetched note id=${id}`);
            return note;
        } catch (error) {
            this.logger.error(`Error fetching note id=${id}`, error.stack);
            throw error;
        }
    }

    async updateNote(currentUser: Payload, id: number, dto: CreateUpdateNotesZodDto) {
        try {
            const [note] = await this.db.select().from(notes).where(eq(notes.id, id));
            if (!note) throw new NotFoundException('Note not found');
            if (currentUser.role !== ROLES.ADMIN && note.userId !== currentUser.userId) {
                throw new ForbiddenException('You cannot update this note');
            }

            const [updated] = await this.db.update(notes).set({
                title: dto.title ?? note.title,
                description: dto.description ?? note.description,
            }).where(eq(notes.id, id)).returning();

            this.logger.log(`User id=${currentUser.userId} updated note id=${id}`);
            return updated;
        } catch (error) {
            this.logger.error(`Error updating note id=${id}`, error.stack);
            throw error;
        }
    }

    async deleteNote(currentUser: Payload, id: number) {
        try {
            const [note] = await this.db.select().from(notes).where(eq(notes.id, id));
            if (!note) throw new NotFoundException('Note not found');
            if (currentUser.role !== ROLES.ADMIN && note.userId !== currentUser.userId) {
                throw new ForbiddenException('You cannot delete this note');
            }

            const [deleted] = await this.db.delete(notes).where(eq(notes.id, id)).returning();
            this.logger.log(`User id=${currentUser.userId} deleted note id=${id}`);
            return deleted;
        } catch (error) {
            this.logger.error(`Error deleting note id=${id}`, error.stack);
            throw error;
        }
    }
}
