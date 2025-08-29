import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NotesModule } from './notes/notes.module';


@Module({
  imports: [DrizzleModule, AuthModule, UsersModule, NotesModule],
})
export class AppModule {}
