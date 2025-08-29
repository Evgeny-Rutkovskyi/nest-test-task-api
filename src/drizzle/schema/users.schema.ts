import { boolean, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";
import { ROLES } from "src/enums/role.enum";

export const rolesEnum = pgEnum("roles", ROLES);

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    role: rolesEnum('role').notNull().default(ROLES.USER),
    isBlock: boolean('is_block').notNull().default(false),
    email: text('email').notNull().unique(),
    password: text('password').notNull()
})