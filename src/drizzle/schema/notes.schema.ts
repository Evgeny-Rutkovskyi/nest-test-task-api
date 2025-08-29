import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { users } from "./users.schema";


export const notes = pgTable('notes', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    userId: integer('userId').references(() => users.id)
})