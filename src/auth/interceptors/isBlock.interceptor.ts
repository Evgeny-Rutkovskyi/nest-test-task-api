import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DrizzleDB } from 'src/drizzle/types/drizzle.type';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { users } from '../../drizzle/schema/users.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserBlockInterceptor implements NestInterceptor {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const { email } = request.body;

    if (!email) {
      throw new ForbiddenException('Email is required');
    }

    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (user && user.isBlock) {
      response.clearCookie('token');
      throw new ForbiddenException('Your account has been blocked');
    }

    return next.handle();
  }
}
