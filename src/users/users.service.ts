import { Injectable, ForbiddenException, NotFoundException, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DrizzleDB } from 'src/drizzle/types/drizzle.type';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { users } from '../drizzle/schema/users.schema';
import { eq, and, ilike } from 'drizzle-orm';
import { ROLES } from 'src/enums/role.enum';
import { Payload } from 'src/types/payload.type';
import { UpdateUserZodDto } from './dto/updateUserZod.dto';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) { }
    
    async createAdmin(id: number) {
        const [{ password, ...updated }] = await this.db
            .update(users)
            .set({ role: ROLES.ADMIN })
            .where(eq(users.id, id))
            .returning();
        
        return updated;
    }

    async getUserById(id: number) {
        try {
            const [{ password, ...user }] = await this.db.select().from(users).where(eq(users.id, id));
            if (!user) throw new NotFoundException('User not found');
            this.logger.log(`Fetched user with id=${id}`);
            return user;
        } catch (error) {
            this.logger.error(`Error fetching user id=${id}`, error.stack);
            throw error;
        }
    }

    async getAllUsers(filter?: { name?: string; isBlock?: boolean }) {
        try {
            let whereClause = [];
            if (filter?.name) whereClause.push(ilike(users.name, `%${filter.name}%`));
            if (typeof filter?.isBlock === 'boolean') whereClause.push(eq(users.isBlock, filter.isBlock));

            const query = this.db.select().from(users);
            if (whereClause.length > 0) query.where(and(...whereClause));

            this.logger.log(`Fetching users with filters: ${JSON.stringify(filter)}`);
            return query;
        } catch (error) {
            this.logger.error('Error fetching users', error.stack);
            throw error;
        }
    }

    async updateUser(currentUser: Payload, dto: UpdateUserZodDto) {
        try {
            if (currentUser.role !== ROLES.ADMIN && currentUser.userId !== dto.id) {
                throw new ForbiddenException('You can only update your own profile');
            }
            const { id, ...updatedFields } = dto;
            const [{ password, ...updated }] = await this.db
                .update(users)
                .set({ ...dto })
                .where(eq(users.id, dto.id))
                .returning();

            this.logger.log(`User id=${currentUser.userId} updated user id=${dto.id}`);
            return updated;
        } catch (error) {
            this.logger.error(`Error updating user id=${dto.id}`, error.stack);
            throw error;
        }
    }

    async blockUser(id: number) {
        try {
            const [{ password, ...updated }] = await this.db.update(users).set({ isBlock: true }).where(eq(users.id, id)).returning();
            this.logger.warn(`User id=${id} was blocked`);
            return updated;
        } catch (error) {
            this.logger.error(`Error blocking user id=${id}`, error.stack);
            throw error;
        }
    }

    async unblockUser(id: number) {
        try {
            const [{ password, ...updated }] = await this.db.update(users).set({ isBlock: false }).where(eq(users.id, id)).returning();
            this.logger.log(`User id=${id} was unblocked`);
            return updated;
        } catch (error) {
            this.logger.error(`Error unblocking user id=${id}`, error.stack);
            throw error;
        }
    }
}
